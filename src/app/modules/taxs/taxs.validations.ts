import { z } from "zod";

export const taxZodSchema = z.object({
  name: z.string({
    error: () => "Name is required!",
  }),
  taxRate: z.string({
    error: () => "Tax rate is required!",
  }),
  country: z.string({
    error: () => "Country is required!",
  }),
  city: z.string({
    error: () => "City is required!",
  }),
  state: z.string({
    error: () => "State is required!",
  }),
  zip: z.string({
    error: () => "ZIP code is required!",
  }),
});
