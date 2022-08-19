import { MyJsonSchema } from "fastify-zod";

export const bindExamples = (
  schemas: MyJsonSchema[],
  examples: { [id: string]: object }
) => {
  if (!schemas || schemas.length === 0) return;

  const properties = schemas[0].properties;
  if (!properties) return;

  Object.keys(properties).forEach((key) => {
    const property = properties[key];
    const example = examples[`${key}Example`];
    property.example = example;
  });
};
