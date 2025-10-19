import { z } from "zod";

export const iconSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Icon name is required!" : "Not a string!",
  }),
  url: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Icon URL is required!" : "Not a string!",
    })
    .url("Invalid icon URL!"),
});

export const imageItemSchema = z.object({
  layout: z
    .enum(["grid", "slider"])
    .refine((val) => ["grid", "slider"].includes(val), {
      message: "View type must be either 'grid' or 'slider'",
    }),
  image: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Image is required!" : "Not a string!",
    })
    .url("Invalid image URL!"),
});

export const createBrandZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Brand name is required!" : "Not a string!",
  }),
  icon: iconSchema,
  images: z
    .array(imageItemSchema)
    .min(1, { message: "At least one image is required!" }),
});
