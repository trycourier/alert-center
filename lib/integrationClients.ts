import Stripe from "stripe";
import { CourierClient } from "@trycourier/courier";
import { AuthenticationClient } from "auth0";

// Initialize all the Integration clients with the auth tokens

export const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2020-08-27",
});

export const courier = CourierClient({
  authorizationToken: process.env.COURIER_AUTH_TOKEN,
});

export const auth0 = new AuthenticationClient({
  domain: process.env.REACT_APP_AUTH0_DOMAIN || "",
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
});
