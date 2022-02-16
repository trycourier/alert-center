import getRawBody from "raw-body";
import Stripe from "stripe";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { stripe, courier } from "../lib/integrationClients";
import { methodConfigs } from "../lib/configs/methods";
import { serviceMethods } from "../lib/configs/services";
import paginateResults from "../lib/paginateResults";
import { listIdFromServiceAndMethod } from "./[service]/subscriptions";

// The notification content using Courier's Elemental Syntax
const content = {
  // Version of the Elemental Syntax
  version: "2022-01-01" as const,
  elements: [
    // This will show up as the title of the notification, if it's supported by the channel
    // (eg. Email Subject)
    {
      type: "meta" as const,
      title: "Stripe Charge",
    },
    // A paragraph of text
    {
      type: "text" as const,
      content:
        "There is a new successful Stripe Charge of **{{amount}} {{currency}}**",
      // Enabling markdown in the content
      format: "markdown" as const,
    },
    {
      type: "text" as const,
      // You can use {{handlebars}} syntax to reference variables from the data
      content: "Description: *{{description}}*",
      format: "markdown" as const,
    },
    // Actions will show up either as a button or a link, depending on the channel
    {
      type: "action" as const,
      content: "View Receipt",
      href: "{{receipt_url}}",
      style: "button" as const,
      background_color: "#9121c2",
    },
  ],
};

/**
 * @api {post} /api/stripe-webhook Stripe webhook
 */
const stripeWebhook = wrapApiFunction(async (request) => {
  if (request.method !== "POST") {
    throw new ApiError("Method Not Allowed", 405);
  }

  // Get the raw body of the request to pass to Stripe, so that it can validate the signature
  const body = await getRawBody(request);

  // Let Stripe parse the body and return the event
  const event = stripe.webhooks.constructEvent(
    body,
    request.headers["stripe-signature"] || "",
    process.env.STRIPE_ENDPOINT_SECRET || ""
  );

  // Only handling the `charge.succeeded` event
  if (event.type !== "charge.succeeded") {
    throw new ApiError("Unhandled event type");
  }

  // We can safely cast the event type here, as we have validated it above
  const charge = event.data.object as Stripe.Charge;

  // Extract the data needed in the Elemental content
  const data = {
    currency: charge.currency,
    description: charge.description,
    amount: charge.amount / 100,
    receipt_url: charge.receipt_url,
  };

  await Promise.all(
    // Go through all the supported Stripe notification methods
    serviceMethods.stripe.map(async (method) => {
      const { provider, channel } = methodConfigs[method];
      // Construct the list id for the notification method
      const listId = listIdFromServiceAndMethod("stripe", method);
      // Get all the recipients subscribed to the list
      const listSubscriptions = await paginateResults((cursor) =>
        courier.lists.getSubscriptions(listId, { cursor })
      );

      return Promise.all(
        // Send the notification to each recipient in the list
        listSubscriptions.map((subscription) => {
          return courier.send({
            message: {
              to: {
                user_id: subscription.recipientId,
              },
              // Route the message to the channel for the notification method
              routing: {
                method: "all",
                channels: [channel],
              },
              // Configure the routed channel to the provider we'd like to use
              channels: {
                [channel]: {
                  providers: [provider],
                },
              },
              // Using Elemental Syntax to build the notification content
              content,
              // Using the data we extracted from the Stripe event
              data,
            },
          });
        })
      );

      // We can also optimize this by sending the notification to an array of recipients with a
      // single call, but it's not supported yet
      //
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

  // By far the most optimized approach would be to directly send the notification to the list,
  // without having to fetch the subscribers first. However, this is not supported yet either
  //
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

// Need to pass unmodified body to Stripe, so need to disable Vercel's default parser
export const config = {
  api: {
    bodyParser: false,
  },
};
