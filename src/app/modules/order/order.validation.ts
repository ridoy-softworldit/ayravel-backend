import { z } from "zod";

// ObjectId validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");

// Shipping Validation
const shippingZodSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["free", "percentage", "amount"], {
    message: "Shipping type must be either 'free', 'percentage', or 'amount'",
  }),
});

// Total Amount Validation
const totalAmountZodSchema = z.object({
  subTotal: z.number({
    error: (issue) =>
      issue.input === undefined ? "SubTotal is required!" : "Must be a number!",
  }),
  tax: z.number().optional().default(0),
  shipping: shippingZodSchema,
  discount: z.number({
    error: (issue) =>
      issue.input === undefined ? "Discount is required!" : "Must be a number!",
  }),
  total: z.number({
    error: (issue) =>
      issue.input === undefined ? "Total is required!" : "Must be a number!",
  }),
});

// Commission Validation
const commissionZodSchema = z.object({
  type: z.enum(["percentage", "fixed"], {
    message: "Commission type must be 'percentage' or 'fixed'",
  }),
  value: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Commission value is required!"
        : "Must be a number!",
  }),
  amount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Commission amount is required!"
        : "Must be a number!",
  }),
});

// Customer Info Validation
const customerInfoZodSchema = z.object({
  firstName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "First name is required!"
        : "Must be a string!",
  }),
  lastName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Last name is required!"
        : "Must be a string!",
  }),
  email: z.string().email().optional(),
  phone: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Phone number is required!"
        : "Must be a string!",
  }),
  address: z.string({
    error: (issue) =>
      issue.input === undefined ? "Address is required!" : "Must be a string!",
  }),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string({
    error: (issue) =>
      issue.input === undefined ? "Country is required!" : "Must be a string!",
  }),
});

// Payment Info Validation
const paymentInfoZodSchema = z.union([
  z.literal("cash-on"),
  z.object({
    cardNumber: z.string().optional(),
    expireDate: z.string().optional(),
    cvc: z.string().optional(),
    nameOnCard: z.string().optional(),
  }),
]);

// Order Info Validation
const orderInfoZodSchema = z.object({
  // orderBy: objectIdSchema.or(
  //   z.string({
  //     error: (issue) =>
  //       issue.input === undefined
  //         ? "OrderBy is required!"
  //         : "Must be a valid ObjectId string!",
  //   })
  // ),
  orderBy: objectIdSchema.or(z.string().default("guest")).optional(),
  // shopInfo: objectIdSchema.or(
  //   z.string({
  //     error: (issue) =>
  //       issue.input === undefined
  //         ? "Shop info is required!"
  //         : "Must be a valid ObjectId string!",
  //   })
  // ),
  productInfo: objectIdSchema.or(
    z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Product info is required!"
          : "Must be a valid ObjectId string!",
    })
  ),
  trackingNumber: z.string().optional(),
  status: z
    .enum(
      [
        "pending",
        "processing",
        "at-local-facility",
        "delivered",
        "cancelled",
        "paid",
      ],
      {
        message:
          "Status must be one of 'pending', 'processing', 'at-local-facility', 'delivered', 'cancelled', or 'paid'",
      }
    )
    .optional()
    .default("pending"),
  isCancelled: z.boolean().optional().default(false),
  quantity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Quantity is required!"
          : "Must be a number!",
    })
    .min(1, "Quantity must be at least 1"),
  totalAmount: totalAmountZodSchema,
  commission: commissionZodSchema,
  orderNote: z.string().optional(),
});

// Main Order Validation
export const createOrderZodSchema = z.object({
  orderInfo: z
    .array(orderInfoZodSchema)
    .min(1, "At least one order info is required!"),

  customerInfo: customerInfoZodSchema,

  paymentInfo: paymentInfoZodSchema,

  totalAmount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Total amount is required!"
        : "Must be a number!",
  }),
});
