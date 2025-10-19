"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const objectIdValidation = zod_1.z
    .string()
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.dashboardValidation = zod_1.z.object({
    summary: objectIdValidation,
    orderStatus: objectIdValidation,
    recentOrders: zod_1.z.array(objectIdValidation).optional(),
    salesHistory: zod_1.z.array(objectIdValidation).optional(),
    popularProducts: zod_1.z.array(objectIdValidation).optional(),
    lowStockProducts: zod_1.z.array(objectIdValidation).optional(),
    topCategoryWithProducts: zod_1.z.array(objectIdValidation).optional(),
    withdrawals: zod_1.z.array(objectIdValidation).optional(),
    attributes: zod_1.z.array(objectIdValidation).optional(),
    taxes: zod_1.z.array(objectIdValidation).optional(),
    shippings: zod_1.z.array(objectIdValidation).optional(),
    orders: zod_1.z.array(objectIdValidation).optional(),
    transactions: zod_1.z.array(objectIdValidation).optional(),
    faqs: zod_1.z.array(objectIdValidation).optional(),
    users: zod_1.z.array(objectIdValidation).optional(),
    vendors: zod_1.z.array(objectIdValidation).optional(),
    customers: zod_1.z.array(objectIdValidation).optional(),
    coupons: zod_1.z.array(objectIdValidation).optional(),
});
