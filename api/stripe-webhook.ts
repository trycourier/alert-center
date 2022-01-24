import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import getRawBody from "raw-body";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const stripeWebhook = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const signature = request.headers["stripe-signature"];

    const body = await getRawBody(request);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );

    if (event.type !== "charge.succeeded") {
      throw new Error("Unhandled event type");
    }

    const charge = event.data.object;

    console.log(charge);

    response.status(200).json({ success: true });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

export default stripeWebhook;

export const config = {
  api: {
    bodyParser: false,
  },
};
