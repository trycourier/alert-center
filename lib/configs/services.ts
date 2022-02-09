import { Method } from "./methods";

const createServiceMethods = <Name extends string>(
  events: Record<Name, Method[]>
) => events;

export const serviceMethods = createServiceMethods({
  stripe: ["email", "sms", "slack"],
});

export type Service = keyof typeof serviceMethods;

const services = Object.keys(serviceMethods) as Service[];

export default services;
