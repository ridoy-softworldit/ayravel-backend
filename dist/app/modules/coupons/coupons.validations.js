"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCouponZodSchema = void 0;
const zod_1 = require("zod");
exports.createCouponZodSchema = zod_1.z.object({
    image: zod_1.z
        .string({
        error: (issue) => issue.input === undefined ? "Image is required!" : "Not a string!",
    })
        .url("Invalid image URL!"),
    code: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Code is required!" : "Not a string!",
    }),
    description: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Description is required!" : "Not a string!",
    }),
    type: zod_1.z.enum(["fixed", "percentage"], { message: "Type must be either 'fixed' or 'percentage'"
    }),
    discountAmount: zod_1.z.number({
        error: (issue) => issue.input === undefined
            ? "Discount amount is required!"
            : "Must be a number!",
    }),
    isVerifiedCustomer: zod_1.z.boolean().optional().default(false),
    isApproved: zod_1.z.boolean().optional().default(false),
    activeDate: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Active date is required!"
            : "Not a valid date string!",
    })
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid active date!",
    }),
    expireDate: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Expire date is required!"
            : "Not a valid date string!",
    })
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid expire date!",
    }),
});
