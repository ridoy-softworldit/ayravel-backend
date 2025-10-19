import { z } from "zod";

// Terms & Conditions validation

// Main SuperAdmin Validation
export const createSuperAdminZodSchema = z.object({
  userId: z.string({
    error: () => "User ID is required!",
  }),
  dashboard: z.string({
    error: () => "Dashboard ID is required!",
  }),
  shops: z
    .array(z.string({ error: () => "Shop ID must be a string!" }))
    .optional(),
  myShops: z
    .array(z.string({ error: () => "MyShop ID must be a string!" }))
    .optional(),
  products: z
    .array(z.string({ error: () => "Product ID must be a string!" }))
    .optional(),
  inventory: z
    .array(z.string({ error: () => "Inventory ID must be a string!" }))
    .optional(),
  brands: z
    .array(z.string({ error: () => "Brand ID must be a string!" }))
    .optional(),
  termsAndCondition: z
    .array(z.string({ error: () => "Brand ID must be a string!" }))
    .optional(),
  becomeASeller: z
    .string({
      error: () => "BecomeASeller ID must be a string!",
    })
    .optional(),
});
