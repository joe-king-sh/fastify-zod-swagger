import fastify from "fastify";
import swagger from "@fastify/swagger";
import fs from "fs";
import { withRefResolver } from "fastify-zod";
import { productSchemas } from "./modules/product.schema";
import productRoutes from "./modules/product.route";

const server = fastify({
  logger: true,
  // OpenAPIのexampleがバリデーションスキーマのビルド時に邪魔になるので、ログ出力のみにする
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
      routePrefix: "docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Sample API using Fastify and Zod.",
          description:
            "ZodのバリデーションスキーマからOpenAPI仕様をいい感じに出力するサンプル",
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
