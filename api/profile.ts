import * as Yup from "yup";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { courier } from "../lib/integrationClients";
import authorize from "../lib/authorize";

const bodySchema = Yup.object().shape({ profile: Yup.object().required() });

const profile = wrapApiFunction(async (request, response) => {
  switch (request.method) {
    case "GET":
      {
        const user = await authorize(request);
        const { profile } = await courier.getProfile({ recipientId: user.sub });

        response.json({ profile });
      }
      break;
    case "POST":
      {
        const { profile } = await bodySchema.validate(request.body);
        const user = await authorize(request);

        await courier.mergeProfile({ recipientId: user.sub, profile });
      }
      break;
    default:
      throw new ApiError("Method Not Allowed", 405);
  }
});

export default profile;
