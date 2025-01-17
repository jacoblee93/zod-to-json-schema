import { JSONSchema7 } from "json-schema";
import { z } from "zod";
import { zodToJsonSchema } from "../src/zodToJsonSchema";

describe("Meta data", () => {
  it("should be possible to use description", () => {
    const $z = z.string().describe("My neat string");
    const $j = zodToJsonSchema($z);
    const $e: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "string",
      description: "My neat string",
    };

    expect($j).toStrictEqual($e);
  });

  it("should be possible to add a markdownDescription", () => {
    const $z = z.string().describe("My neat string");
    const $j = zodToJsonSchema($z, { markdownDescription: true });
    const $e = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "string",
      description: "My neat string",
      markdownDescription: "My neat string",
    };

    expect($j).toStrictEqual($e);
  });

  it("should handle optional schemas with different descriptions", () => {
    const recurringSchema = z.object({});
    const zodSchema = z
      .object({
        p1: recurringSchema.optional().describe("aaaaaaaaa"),
        p2: recurringSchema.optional().describe("bbbbbbbbb"),
        p3: recurringSchema.optional().describe("ccccccccc"),
      })
      .describe("sssssssss");

    const jsonSchema = zodToJsonSchema(zodSchema, {
      target: "openApi3",
      $refStrategy: "none",
    });

    expect(jsonSchema).toStrictEqual({
      additionalProperties: false,
      description: "sssssssss",
      properties: {
        p1: {
          additionalProperties: false,
          description: "aaaaaaaaa",
          properties: {},
          type: "object",
        },
        p2: {
          additionalProperties: false,
          description: "bbbbbbbbb",
          properties: {},
          type: "object",
        },
        p3: {
          additionalProperties: false,
          description: "ccccccccc",
          properties: {},
          type: "object",
        },
      },
      type: "object",
    });
  });
});
