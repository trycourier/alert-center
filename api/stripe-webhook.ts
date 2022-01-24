import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripeWebhook = (request: VercelRequest, response: VercelResponse) => {
  const { name } = request.query;
  response.status(200).send(`Hello ${name}!`);
};

export default stripeWebhook;
