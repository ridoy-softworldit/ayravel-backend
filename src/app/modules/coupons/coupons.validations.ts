import { z } from "zod";

export const createCouponZodSchema = z.object({
  image: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Image is required!" : "Not a string!",
    })
    .url("Invalid image URL!"),

  code: z.string({
    error: (issue) =>
      issue.input === undefined ? "Code is required!" : "Not a string!",
  }),

  description: z.string({
    error: (issue) =>
      issue.input === undefined ? "Description is required!" : "Not a string!",
  }),

  type: z.enum(["fixed", "percentage"], {message: "Type must be either 'fixed' or 'percentage'"
  }),

  discountAmount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Discount amount is required!"
        : "Must be a number!",
  }),

  isVerifiedCustomer: z.boolean().optional().default(false),

  isApproved: z.boolean().optional().default(false),

  activeDate: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Active date is required!"
          : "Not a valid date string!",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid active date!",
    }),

  expireDate: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Expire date is required!"
          : "Not a valid date string!",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid expire date!",
    }),
});
