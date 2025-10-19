"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendorZodSchema = void 0;
const zod_1 = require("zod");
// Summery validation
const summeryZodSchema = zod_1.z.object({
    totalRevenue: zod_1.z.number().default(0),
    todaysRevenue: zod_1.z.number().default(0),
    todaysRefund: zod_1.z.number().default(0),
    totalShop: zod_1.z.number().default(0),
});
// Order Status validation
const orderStatusZodSchema = zod_1.z.object({
    pending: zod_1.z.number().default(0),
    processing: zod_1.z.number().default(0),
    completed: zod_1.z.number().default(0),
    cancelled: zod_1.z.number().default(0),
});
// Sales History validation
const salesHistoryZodSchema = zod_1.z.object({
    totalSales: zod_1.z.number().default(0),
    months: zod_1.z
        .enum([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ])
        .default("January"),
});
// Top Category validation
const topCategoryZodSchema = zod_1.z.object({
    categoryId: zod_1.z.string().nullable().default(null),
    categoryName: zod_1.z.string().default(""),
    shop: zod_1.z.string().default(""),
    totalProducts: zod_1.z.number().default(0),
});
// Main Vendor Validation
exports.createVendorZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "UserId is required!",
    }),
    shops: zod_1.z.string().nullable().optional().default(null),
    shopTransfer: zod_1.z.array(zod_1.z.string()).default([]),
    messages: zod_1.z.array(zod_1.z.string()).default([]),
    storeNotices: zod_1.z.array(zod_1.z.string()).default([]),
    summery: summeryZodSchema.optional(),
    orderStatus: orderStatusZodSchema.optional(),
    salesHistory: zod_1.z.array(salesHistoryZodSchema).default([]),
    topCategoryByProducts: zod_1.z.array(topCategoryZodSchema).default([]),
    status: zod_1.z.enum(["pending", "approved"]).default("pending"),
});
