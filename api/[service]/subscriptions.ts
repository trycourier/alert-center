import * as Yup from "yup";

import wrapApiFunction, { ApiError } from "../../lib/wrapApiFunction";
import { courier } from "../../lib/integrationClients";
import authorize from "../../lib/authorize";
import {
  methodConfigs,
  Method,
  PublicSubscription,
} from "../../lib/configs/methods";
import services, { serviceMethods, Service } from "../../lib/configs/services";

const pathSchema = Yup.object().shape({
  service: Yup.string().oneOf(services).required(),
});

// Helper function to build a Courier list id from Alert Service and Notification Method
export const listIdFromServiceAndMethod = (service: Service, method: Method) =>
  ["alerts", service, method].join(".");

/**
 * @api {get/post/delete} /api/:service/subscriptions Wrapper for Courier List Subscription API
 * @apiParam {String} service Alert Service name
 * @apiParam {String} method Notification Method name
 */
const subscriptions = wrapApiFunction(async (request, response) => {
  // Validate the request path to include only a supported service
  const { service } = await pathSchema.validate(request.query);
  // Each service can only support a limited set of notification methods
  const currentServiceMethods = serviceMethods[service as Service];

  switch (request.method) {
    // Get the current user's subscriptions for the given service,
    // along with the configuration needed display the Preferences UI
    case "GET":
      {
        // Authorize the user
        const user = await authorize(request);
        // Get all Courier list subscriptions for the current user
        const { results } = await courier.getRecipientSubscriptions({
          // use user.sub as Courier recipientId
          recipientId: user.sub,
        });
        // Go over Alert Service's supported notification methods and build
        // the config and will be passed to client side
        const subscriptions: PublicSubscription[] = currentServiceMethods.map(
          (method) => {
            // Remove any config fields that are not needed for the UI
            const { channel, provider, ...methodConfig } =
              methodConfigs[method];

            return {
              method,
              ...methodConfig,
              // The recipient is subscribed to the method if the list id is present
              // in the Courier list subscriptions array
              subscribed: results.some(
                (sub) =>
                  sub.id ===
                  listIdFromServiceAndMethod(service as Service, method)
              ),
            };
          }
        );

        response.json({ subscriptions });
      }
      break;

    // Subscribe/unsubscribe the current user to the given Alert Service
    // and Notification Method
    case "POST":
    case "DELETE":
      {
        // Allow only the methods that are supported by the service
        const bodySchema = Yup.object().shape({
          method: Yup.string().oneOf(currentServiceMethods).required(),
        });
        const { method } = await bodySchema.validate(request.body);
        // Authorize the user
        const user = await authorize(request);
        // Build the list id from the service and method
        const listId = listIdFromServiceAndMethod(
          service as Service,
          method as Method
        );

        // User Courier API to subscribe to the list if the request
        // method is a POST, unsubscribe if DELETE
        if (request.method === "POST") {
          await courier.lists.subscribe(listId, user.sub);
        } else {
          await courier.lists.unsubscribe(listId, user.sub);
        }
      }
      break;
    default:
      throw new ApiError("Method Not Allowed", 405);
  }
});

export default subscriptions;
