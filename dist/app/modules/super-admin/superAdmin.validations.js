"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdminZodSchema = void 0;
const zod_1 = require("zod");
// Terms & Conditions validation
// Main SuperAdmin Validation
exports.createSuperAdminZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "User ID is required!",
    }),
    dashboard: zod_1.z.string({
        error: () => "Dashboard ID is required!",
    }),
    shops: zod_1.z
        .array(zod_1.z.string({ error: () => "Shop ID must be a string!" }))
        .optional(),
    myShops: zod_1.z
        .array(zod_1.z.string({ error: () => "MyShop ID must be a string!" }))
        .optional(),
    products: zod_1.z
        .array(zod_1.z.string({ error: () => "Product ID must be a string!" }))
        .optional(),
    inventory: zod_1.z
        .array(zod_1.z.string({ error: () => "Inventory ID must be a string!" }))
        .optional(),
    brands: zod_1.z
        .array(zod_1.z.string({ error: () => "Brand ID must be a string!" }))
        .optional(),
    termsAndCondition: zod_1.z
        .array(zod_1.z.string({ error: () => "Brand ID must be a string!" }))
        .optional(),
    becomeASeller: zod_1.z
        .string({
        error: () => "BecomeASeller ID must be a string!",
    })
        .optional(),
});
