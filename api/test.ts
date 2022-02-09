import * as Yup from "yup";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { courier } from "../lib/integrationClients";
import authorize from "../lib/authorize";
import methods, { methodConfigs, Method } from "../lib/configs/methods";

const schema = Yup.object().shape({
  method: Yup.string().oneOf(methods).required(),
});

const test = wrapApiFunction(async (request) => {
  switch (request.method) {
    case "POST":
      {
        const { method } = await schema.validate(request.body);
        const { provider, channel } = methodConfigs[method as Method];
        const user = await authorize(request);

        await courier.send({
          message: {
            to: { user_id: user.sub },
            routing: {
              method: "all",
              channels: [channel],
            },
            channels: {
              [channel]: {
                providers: [provider],
              },
            },
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
