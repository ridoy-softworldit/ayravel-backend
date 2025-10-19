"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderZodSchema = void 0;
const zod_1 = require("zod");
// ObjectId validation
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");
// Shipping Validation
const shippingZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    type: zod_1.z.enum(["free", "percentage", "amount"], {
        message: "Shipping type must be either 'free', 'percentage', or 'amount'",
    }),
});
// Total Amount Validation
const totalAmountZodSchema = zod_1.z.object({
    subTotal: zod_1.z.number({
        error: (issue) => issue.input === undefined ? "SubTotal is required!" : "Must be a number!",
    }),
    tax: zod_1.z.number().optional().default(0),
    shipping: shippingZodSchema,
    discount: zod_1.z.number({
        error: (issue) => issue.input === undefined ? "Discount is required!" : "Must be a number!",
    }),
    total: zod_1.z.number({
        error: (issue) => issue.input === undefined ? "Total is required!" : "Must be a number!",
    }),
});
// Commission Validation
const commissionZodSchema = zod_1.z.object({
    type: zod_1.z.enum(["percentage", "fixed"], {
        message: "Commission type must be 'percentage' or 'fixed'",
    }),
    value: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Commission value is required!"
            : "Must be a number!",
    }),
    amount: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Commission amount is required!"
            : "Must be a number!",
    }),
});
// Customer Info Validation
const customerInfoZodSchema = zod_1.z.object({
    firstName: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "First name is required!"
            : "Must be a string!",
    }),
    lastName: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Last name is required!"
            : "Must be a string!",
    }),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Phone number is required!"
            : "Must be a string!",
    }),
    address: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Address is required!" : "Must be a string!",
    }),
    city: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Country is required!" : "Must be a string!",
    }),
});
// Payment Info Validation
const paymentInfoZodSchema = zod_1.z.union([
    zod_1.z.literal("cash-on"),
    zod_1.z.object({
        cardNumber: zod_1.z.string().optional(),
        expireDate: zod_1.z.string().optional(),
        cvc: zod_1.z.string().optional(),
        nameOnCard: zod_1.z.string().optional(),
    }),
]);
// Order Info Validation
const orderInfoZodSchema = zod_1.z.object({
    // orderBy: objectIdSchema.or(
    //   z.string({
    //     error: (issue) =>
    //       issue.input === undefined
    //         ? "OrderBy is required!"
    //         : "Must be a valid ObjectId string!",
    //   })
    // ),
    orderBy: objectIdSchema.or(zod_1.z.string().default("guest")).optional(),
    // shopInfo: objectIdSchema.or(
    //   z.string({
    //     error: (issue) =>
    //       issue.input === undefined
    //         ? "Shop info is required!"
    //         : "Must be a valid ObjectId string!",
    //   })
    // ),
    productInfo: objectIdSchema.or(zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Product info is required!"
            : "Must be a valid ObjectId string!",
    })),
    trackingNumber: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([
        "pending",
        "processing",
        "at-local-facility",
        "delivered",
        "cancelled",
        "paid",
    ], {
        message: "Status must be one of 'pending', 'processing', 'at-local-facility', 'delivered', 'cancelled', or 'paid'",
    })
        .optional()
        .default("pending"),
    isCancelled: zod_1.z.boolean().optional().default(false),
    quantity: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Quantity is required!"
            : "Must be a number!",
    })
        .min(1, "Quantity must be at least 1"),
    totalAmount: totalAmountZodSchema,
    commission: commissionZodSchema,
    orderNote: zod_1.z.string().optional(),
});
// Main Order Validation
exports.createOrderZodSchema = zod_1.z.object({
    orderInfo: zod_1.z
        .array(orderInfoZodSchema)
        .min(1, "At least one order info is required!"),
    customerInfo: customerInfoZodSchema,
    paymentInfo: paymentInfoZodSchema,
    totalAmount: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Total amount is required!"
            : "Must be a number!",
    }),
});
