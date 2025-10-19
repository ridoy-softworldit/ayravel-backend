import { z } from "zod";

// shipping validation
export const createShippingZodSchema = z.object({
  name: z.string({
    error: () => "Shipping name is required!",
  }),
  type: z.enum(["free", "fixed", "percentage"], {
    message: "Type must be either 'free', 'fixed' or 'percentage'",
  }),
  amount: z
    .number({
      error: () => "Shipping amount is required!",
    })
    .min(0, { message: "Amount cannot be negative" }),
  global: z.enum(["0", "1"], {
    message: "Global must be either '0' or '1'",
  }),
});
