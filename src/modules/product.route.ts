import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler } from "./product.controller";
import { $ref } from "./product.schema";

const productRoutes = async (server: FastifyInstance) => {
  server.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: { 201: $ref("productResponseSchema") },
    },
    handler: createProductHandler,
  });

  server.get("/:id", {
    schema: {
      params: $ref("getProductParamsSchema"),
      querystring: $ref("getProductQuerySchema"),
      response: {
        200: {
          ...$ref("productResponseSchema"),
          description: "製品が見つかった",
        },
      },
    },
    handler: getProductHandler,
  });
};

export default productRoutes;
