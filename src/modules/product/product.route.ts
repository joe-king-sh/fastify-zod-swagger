import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler } from "./product.controller";
import { $ref } from "./product.schema";

const productRoutes = async (server: FastifyInstance) => {
  server.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: {
        201: { ...$ref("productResponseSchema"), description: "登録完了" },
      },
      tags: ["Product"],
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
          description: "取得成功",
        },
      },
      tags: ["Product"],
    },
    handler: getProductHandler,
  });
};

export default productRoutes;
