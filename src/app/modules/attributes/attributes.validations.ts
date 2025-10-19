import { z } from "zod";

export const attributeItemSchema = z.object({
  value: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Attribute value is required!"
        : "Not a string!",
  }),
  meta: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Attribute meta is required!"
        : "Not a string!",
  }),
});

export const createAttributesZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Attribute name is required!"
        : "Not a string!",
  }),
  slug: z.string().optional(),
  attributes: z
    .array(attributeItemSchema)
    .min(1, { message: "At least one attribute is required!" }),
});


export const updateAttributesZodSchema = z.object({
  name: z.string({
    error: issue =>
      issue.input === undefined
        ? 'Attribute name is required!'
        : 'Not a string!',
  }),
  slug: z.string().optional(),
  attributes: z
    .array(attributeItemSchema)
    .min(1, { message: 'At least one attribute is required!' }),
});
