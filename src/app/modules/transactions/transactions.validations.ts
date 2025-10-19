import { z } from "zod";

export const shippingZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Shipping name is required!"
        : "Not a string!",
  }),
  type: z.enum(["free", "percentage", "fixed"], {
    message: "Shipping type must be one of: 'free', 'percentage', 'fixed'",
  }),
  amount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Shipping amount is required!"
        : "Must be a number!",
  }),
});

export const paymentInfoZodSchema = z.object({
  paymentGateway: z.enum(["cash-on"], {
    message: "Payment gateway must be 'cash-on'",
  }),
  status: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "Payment status is required!"
        : "Must be a boolean!",
  }),
});

export const createTransactionZodSchema = z.object({
  trackingNumber: z.string().optional(),

  total: z.number({
    error: (issue) =>
      issue.input === undefined ? "Total is required!" : "Must be a number!",
  }),

  productPrice: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Product price is required!"
        : "Must be a number!",
  }),

  shipping: shippingZodSchema,

  tax: z.number({
    error: (issue) =>
      issue.input === undefined ? "Tax is required!" : "Must be a number!",
  }),

  discount: z.number().optional().default(0),

  paymentInfo: paymentInfoZodSchema,
});
