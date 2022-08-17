import { z } from "zod";
import { buildJsonSchemas, JsonSchema } from "fastify-zod";

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

// スキーマ定義
const createProductBodySchema = z
  .object({
    ...productInput,
  })
  .refine((value) => {
    value.salesStartsAt <= value.salesEndsAt,
      {
        message: "salesStartsAt must be before salesEndsAt",
      };
  })
  .describe("Create product body schema");

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

// Zodスキーマから型生成
export type CreateProductInput = z.infer<typeof createProductBodySchema>;
export type ProductOutput = z.infer<typeof productResponseSchema>;
export type GetProductParamsInput = z.infer<typeof getProductParamsSchema>;
export type GetProductQueryInput = z.infer<typeof getProductQuerySchema>;

// 型を元にスキーマのExamplesを定義
const exampleProduct: ProductOutput = {
  title: "何らかの製品A",
  price: 10_000,
  content: "素晴らしい製品です",
  type: "game",
  salesStartsAt: new Date(),
  salesEndsAt: new Date(),
  id: "c165ad23-2ac3-4d80-80d7-d7b6c3e526bd",
  createdAt: new Date(),
  updatedAt: new Date(),
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

// ZodスキーマからJSONスキーマを生成
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

// JSONスキーマにExampleを追加(Zodのままだと追加できない)
const bindExamples = (schemas: JsonSchema[], examples: object) => {
  if (!schemas || schemas.length === 0) return;

  console.log(examples);

  const properties = schemas[0].properties;

  for (const key in properties) {
    const property = properties[key];
    console.log(key);
    const example = examples[`${key}Example`];

    console.log({ example });

    property.example = example;
  }

  // console.log(JSON.stringify(productSchemas, null, 2));
};

bindExamples(productSchemas, schemaExamples);

// console.log(JSON.stringify(productSchemas, null, 2));
