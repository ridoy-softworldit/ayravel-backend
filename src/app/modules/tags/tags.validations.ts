import { z } from "zod";

export const iconSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

export const createTagZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Tag name is required!" : "Not a string!",
  }),
  slug: z.string().optional(),
  type: z.string().optional(),
  details: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "A short detail is required!"
        : "Not a string!",
  }),
  icon: iconSchema,
  image: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Image URL is required!" : "Not a string!",
    })
    .url("Invalid image URL!"),
});

export const updateiconSchema = z.object({
  name: z.string(),
  url: z.string().url("Invalid icon URL!"),
});

export const updateTagZodSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  type: z.string().optional(),
  details: z.string().optional(),
  icon: updateiconSchema.optional(),
  image: z.string().url("Invalid image URL!").optional(),
});
