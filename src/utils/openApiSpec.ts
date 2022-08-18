import { _JsonSchema } from "fastify-zod";

export const bindExamples = (
  schemas: _JsonSchema[],
  examples: { [id: string]: object }
) => {
  if (!schemas || schemas.length === 0) return;

  const properties = schemas[0].properties;

  for (const key in properties) {
    const property = properties[key];
    const example = examples[`${key}Example`];

    property.example = example;
  }
};
