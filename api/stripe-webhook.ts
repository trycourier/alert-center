import getRawBody from "raw-body";
import Stripe from "stripe";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { stripe, courier } from "../lib/integrationClients";
import { methodConfigs } from "../lib/configs/methods";
import { serviceMethods } from "../lib/configs/services";
import paginateResults from "../lib/paginateResults";
import { listIdFromServiceAndMethod } from "./[service]/subscriptions";

const stripeWebhook = wrapApiFunction(async (request) => {
  if (request.method !== "POST") {
    throw new ApiError("Method Not Allowed", 405);
  }

  const signature = request.headers["stripe-signature"] || "";

  const body = await getRawBody(request);

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_ENDPOINT_SECRET || ""
  );

  if (event.type !== "charge.succeeded") {
    throw new Error("Unhandled event type");
  }

  const charge = event.data.object as Stripe.Charge;
  const content = {
    version: "2022-01-01" as const,
    elements: [
      {
        type: "meta" as const,
        title: "Stripe Charge",
      },
      {
        type: "text" as const,
        content:
          "There is a new successful Stripe Charge of **{{amount}} {{currency}}**",
        format: "markdown" as const,
      },
      {
        type: "text" as const,
        content: "Description: *{{description}}*",
        format: "markdown" as const,
      },
      {
        type: "action" as const,
        content: "View Receipt",
        href: "{{receipt_url}}",
        style: "button" as const,
        backgroundColor: "#9121c2",
      },
    ],
  };
  const data = {
    currency: charge.currency,
    description: charge.description,
    amount: charge.amount / 100,
    receipt_url: charge.receipt_url,
  };

  await Promise.all(
    serviceMethods.stripe.map(async (method) => {
      const { provider, channel } = methodConfigs[method];
      const listId = listIdFromServiceAndMethod("stripe", method);
      const listSubscriptions = await paginateResults((cursor) =>
        courier.lists.getSubscriptions(listId, { cursor })
      );

      return Promise.all(
        listSubscriptions.map((subscription) => {
          return courier.send({
            message: {
              to: {
                user_id: subscription.recipientId,
              },
              routing: {
                method: "all",
                channels: [channel],
              },
              channels: {
                [channel]: {
                  providers: [provider],
                },
              },
              content,
              data,
            },
          });
        })
      );

      // return courier.send({
      //   message: {
      //     to: listSubscriptions.map((subscription) => ({
      //       user_id: subscription.recipientId,
      //     })),
      //     routing: {
      //       method: "all",
      //       channels: [channel],
      //     },
      //     channels: {
      //       [channel]: {
      //         providers: [provider],
      //       },
      //     },
      //     content,
      //     data,
      //   },
      // });
    })
  );

  // await Promise.all(
  //   serviceMethods.stripe.map((method) => {
  //     const { provider, channel } = methodConfigs[method];

  //     return courier.send({
  //       message: {
  //         to: { list_id: listIdFromServiceAndMethod("stripe", method) },
  //         routing: {
  //           method: "all",
  //           channels: [channel],
  //         },
  //         channels: {
  //           [channel]: {
  //             providers: [provider],
  //           },
  //         },
  //         content,
  //         data,
  //       },
  //     });
  //   })
  // );
});

export default stripeWebhook;

export const config = {
  api: {
    bodyParser: false,
  },
};
