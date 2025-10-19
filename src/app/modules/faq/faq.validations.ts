import { z } from "zod";

export const createFaqZodSchema = z.object({
  title: z.string({
    error: () => "Title is required!",
  }),
  description: z.string({
    error: () => "Description is required!",
  }),
  type: z.enum(["global", "shop"], {
    message: "Type must be either 'global' or 'shop'",
  }),
  issuedBy: z.string({
    error: () => "IssuedBy is required!",
  }),
});
