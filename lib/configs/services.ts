import { Method } from "./methods";

// A helper function to let TypeScript correctly infer types
const createServiceMethods = <Name extends string>(
  serviceMethods: Record<Name, Method[]>
) => serviceMethods;

// Each Alert service may support only a limited set of Notification methods
export const serviceMethods = createServiceMethods({
  stripe: ["email", "sms", "slack"],
});

export type Service = keyof typeof serviceMethods;

const services = Object.keys(serviceMethods) as Service[];

export default services;
