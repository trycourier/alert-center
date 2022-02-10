import * as Yup from "yup";

import wrapApiFunction, { ApiError } from "../lib/wrapApiFunction";
import { courier } from "../lib/integrationClients";
import authorize from "../lib/authorize";

const bodySchema = Yup.object().shape({ profile: Yup.object().required() });

/**
 * @api {get/post} /api/profile Wrapper for Courier Profile API
 * @apiParam {Object} profile Courier Profile Object
 */
const profile = wrapApiFunction(async (request, response) => {
  switch (request.method) {
    // Get the current user's profile
    case "GET":
      {
        // Authorizing the request
        const user = await authorize(request);
        // Getting the profile from Courier
        const { profile } = await courier.getProfile({ recipientId: user.sub });

        response.json({ profile });
      }
      break;
    // Update the current user's profile
    case "POST":
      {
        // Validate the request body
        const { profile } = await bodySchema.validate(request.body);
        // Authorizing the request
        const user = await authorize(request);

        // Use Courier API to merge the new profile with the existing profile
        await courier.mergeProfile({ recipientId: user.sub, profile });
      }
      break;
    default:
      throw new ApiError("Method Not Allowed", 405);
  }
});

export default profile;
