import { z } from "zod";

export const iconSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

export const createCategoryZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Category name is required!"
        : "Not a string!",
  }),
  slug: z.string().optional(),
  details: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Category description is required!"
        : "Not a string!",
  }),
  icon: iconSchema,
  subCategories: z.array(z.string()).default([]).optional(),
});

export const editIconSchema = z.object({
  name: z.string().optional(),
  url: z.string().url("Invalid icon URL!").optional(),
  image: z.string().url("Invalid image URL!").optional(),
  bannerImg: z.string().url("Invalid banner image URL!").optional(),
});

export const updateCategoryZodSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  details: z.string().optional(),
  icon: editIconSchema.optional(),
  subCategories: z.array(z.string()).default([]),
  image: z.string().url("Invalid image URL!").optional(),
  bannerImg: z.string().url("Invalid banner image URL!").optional(),
  deletedImages: z.array(z.string()).optional(),
});
