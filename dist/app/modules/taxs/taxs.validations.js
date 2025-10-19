"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxZodSchema = void 0;
const zod_1 = require("zod");
exports.taxZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: () => "Name is required!",
    }),
    taxRate: zod_1.z.string({
        error: () => "Tax rate is required!",
    }),
    country: zod_1.z.string({
        error: () => "Country is required!",
    }),
    city: zod_1.z.string({
        error: () => "City is required!",
    }),
    state: zod_1.z.string({
        error: () => "State is required!",
    }),
    zip: zod_1.z.string({
        error: () => "ZIP code is required!",
    }),
});
