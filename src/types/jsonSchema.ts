import { JsonSchema } from "fastify-zod";

declare module "fastify-zod" {
  interface JsonSchema {
    examples?: Array<object>;
    properties?: JsonSchema;
  }
}
