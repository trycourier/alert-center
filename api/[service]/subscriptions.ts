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

export const listIdFromServiceAndMethod = (service: Service, method: Method) =>
  ["alerts", service, method].join(".");

const subscriptions = wrapApiFunction(async (request, response) => {
  const { service } = await pathSchema.validate(request.query);
  const currentServiceMethods = serviceMethods[service as Service];

  switch (request.method) {
    case "GET":
      {
        const user = await authorize(request);
        const { results } = await courier.getRecipientSubscriptions({
          recipientId: user.sub,
        });
        const subscriptions: PublicSubscription[] = currentServiceMethods.map(
          (method) => {
            const { channel, provider, ...methodConfig } =
              methodConfigs[method];

            return {
              method,
              ...methodConfig,
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
    case "POST":
    case "DELETE":
      {
        const bodySchema = Yup.object().shape({
          method: Yup.string().oneOf(currentServiceMethods).required(),
        });
        const { method } = await bodySchema.validate(request.body);
        const user = await authorize(request);
        const listId = listIdFromServiceAndMethod(
          service as Service,
          method as Method
        );

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
