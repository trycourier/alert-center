import * as Yup from "yup";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { courier } from "../lib/integrationClients";
import authorize from "../lib/authorize";
import methods, { methodConfigs, Method } from "../lib/configs/methods";

const schema = Yup.object().shape({
  method: Yup.string().oneOf(methods).required(),
});

/**
 * @api {post} /api/test Send a test notification to check that the setup is correct
 * @apiParam {string} method - One of the supported notification methods
 */
const test = wrapApiFunction(async (request) => {
  switch (request.method) {
    case "POST":
      {
        // Validate that the request body defines a supported notification method
        const { method } = await schema.validate(request.body);
        const { provider, channel } = methodConfigs[method as Method];
        // Authorize request
        const user = await authorize(request);

        // Send the test notification using Courier's API
        await courier.send({
          message: {
            // Using user.sub as the recipient ID
            to: {
              user_id: user.sub,
            },
            // Routing the message to the channel for the notification method
            routing: {
              method: "all",
              channels: [channel],
            },
            // Configuring the routed channel to the provider we'd like to use
            channels: {
              [channel]: {
                providers: [provider],
              },
            },
            // Using Elemental Sugar to build the notification content
            content: {
              title: "Alert Center",
              body: "This is a test notification from Courier Alert Center",
            },
          },
        });
      }
      break;
    default:
      throw new ApiError("Method Not Allowed", 405);
  }
});

export default test;
