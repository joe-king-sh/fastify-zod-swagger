import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { bindExamples } from "../../utils/openApiSpec";

export const ProductType = {
  book: "book",
  movie: "movie",
  game: "game",
} as const;

const productInput = {
  title: z.string().min(3).max(50).describe("製品登録名"),
  price: z.number().max(900000).default(100).describe("価格"),
  content: z.nullable(z.string()).optional().describe("内容"),
  type: z.nativeEnum(ProductType).describe("製品種別"),
  salesStartsAt: z.date().describe("販売開始日"),
  salesEndsAt: z.date().describe("販売終了日"),
};

const productGenerated = {
  id: z.string().uuid().describe("製品ID"),
  createdAt: z.date().describe("作成日"),
  updatedAt: z.date().describe("更新日"),
};

// Zod schema definitions.
const createProductBodySchema = z.object({
  ...productInput,
});

const productResponseSchema = z
  .object({
    ...productInput,
    ...productGenerated,
  })
  .describe("Product response schema");

const getProductParamsSchema = z.object({
  id: productGenerated.id,
});
const getProductQuerySchema = z.object({
  title: z.optional(productInput.title),
  type: z.optional(z.array(productInput.type)),
});

// Generate types from zod schemas.
export type CreateProductInput = z.infer<typeof createProductBodySchema>;
export type ProductOutput = z.infer<typeof productResponseSchema>;
export type GetProductParamsInput = z.infer<typeof getProductParamsSchema>;
export type GetProductQueryInput = z.infer<typeof getProductQuerySchema>;

// Examples of schemas from types definitions.
const exampleProduct: ProductOutput = {
  title: "何らかの製品A",
  price: 10_000,
  content: "素晴らしい製品です",
  type: "game",
  salesStartsAt: new Date("2022-01-01"),
  salesEndsAt: new Date("2022-12-31"),
  id: "c165ad23-2ac3-4d80-80d7-d7b6c3e526bd",
  createdAt: new Date("2022-06-01"),
  updatedAt: new Date("2022-06-01"),
};
const createProductBodySchemaExample: CreateProductInput = {
  title: exampleProduct.title,
  price: exampleProduct.price,
  content: exampleProduct.content,
  type: exampleProduct.type,
  salesStartsAt: exampleProduct.salesStartsAt,
  salesEndsAt: exampleProduct.salesEndsAt,
};
const productResponseSchemaExample: ProductOutput = { ...exampleProduct };
const getProductParamsSchemaExample: GetProductParamsInput = {
  id: exampleProduct.id,
};
const getProductQuerySchemaExample: GetProductQueryInput = {
  title: exampleProduct.title,
  type: [exampleProduct.type],
};
const schemaExamples = {
  createProductBodySchemaExample,
  productResponseSchemaExample,
  getProductParamsSchemaExample,
  getProductQuerySchemaExample,
};

// Generate jsonschemas from zod schamas.
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductBodySchema,
    productResponseSchema,
    getProductParamsSchema,
    getProductQuerySchema,
  },
  {
    $id: "productSchemas",
  }
);

bindExamples(productSchemas, schemaExamples);
