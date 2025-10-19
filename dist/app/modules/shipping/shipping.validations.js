"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingZodSchema = void 0;
const zod_1 = require("zod");
// shipping validation
exports.createShippingZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: () => "Shipping name is required!",
    }),
    type: zod_1.z.enum(["free", "fixed", "percentage"], {
        message: "Type must be either 'free', 'fixed' or 'percentage'",
    }),
    amount: zod_1.z
        .number({
        error: () => "Shipping amount is required!",
    })
        .min(0, { message: "Amount cannot be negative" }),
    global: zod_1.z.enum(["0", "1"], {
        message: "Global must be either '0' or '1'",
    }),
});
