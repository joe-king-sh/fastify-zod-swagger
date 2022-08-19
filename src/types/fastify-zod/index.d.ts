import { JsonSchema } from "fastify-zod";

declare module "fastify-zod" {
  type MyJsonSchema = JsonSchema & {
    properties?: {
      [key: string]: {
        type: string;
        properties: {
          [key: string]: object;
        };
        example: object;
      };
    };
  };
}
