import fastify from "fastify";
import swagger from "@fastify/swagger";
import fs from "fs";
import { withRefResolver } from "fastify-zod";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";

const server = fastify({
  logger: true,
  // The example attribute for OpenAPI is disturbed by Ajv validation,
  // so it should be log output only.
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["example"],
    },
  },
});

const main = async () => {
  for (const schema of productSchemas) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: "/docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Sample API using Fastify and Zod.",
          description:
            "ZodのバリデーションスキーマからリッチなOpenAPI仕様を出力するサンプル",
          version: "1.0.0",
        },
      },
    })
  );

  server.register(productRoutes, { prefix: "/products" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listining on port 3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const responseYaml = await server.inject("/docs/yaml");
  fs.writeFileSync("docs/openapi.yaml", responseYaml.payload);
};

main();
