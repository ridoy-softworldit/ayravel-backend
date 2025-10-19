"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionZodSchema = exports.paymentInfoZodSchema = exports.shippingZodSchema = void 0;
const zod_1 = require("zod");
exports.shippingZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Shipping name is required!"
            : "Not a string!",
    }),
    type: zod_1.z.enum(["free", "percentage", "fixed"], {
        message: "Shipping type must be one of: 'free', 'percentage', 'fixed'",
    }),
    amount: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Shipping amount is required!"
            : "Must be a number!",
    }),
});
exports.paymentInfoZodSchema = zod_1.z.object({
    paymentGateway: zod_1.z.enum(["cash-on"], {
        message: "Payment gateway must be 'cash-on'",
    }),
    status: zod_1.z.boolean({
        error: (issue) => issue.input === undefined
            ? "Payment status is required!"
            : "Must be a boolean!",
    }),
});
exports.createTransactionZodSchema = zod_1.z.object({
    trackingNumber: zod_1.z.string().optional(),
    total: zod_1.z.number({
        error: (issue) => issue.input === undefined ? "Total is required!" : "Must be a number!",
    }),
    productPrice: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Product price is required!"
            : "Must be a number!",
    }),
    shipping: exports.shippingZodSchema,
    tax: zod_1.z.number({
        error: (issue) => issue.input === undefined ? "Tax is required!" : "Must be a number!",
    }),
    discount: zod_1.z.number().optional().default(0),
    paymentInfo: exports.paymentInfoZodSchema,
});
