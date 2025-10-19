"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSummaryZodSchema = void 0;
const zod_1 = require("zod");
exports.createSummaryZodSchema = zod_1.z.object({
    totalRevenue: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Total revenue is required!"
            : "Total revenue must be a number!",
    })
        .min(0, "Total revenue cannot be negative"),
    orders: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Orders count is required!"
            : "Orders must be a number!",
    })
        .min(0, "Orders cannot be negative"),
    vendors: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Vendors count is required!"
            : "Vendors must be a number!",
    })
        .min(0, "Vendors cannot be negative"),
    shops: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Shops count is required!"
            : "Shops must be a number!",
    })
        .min(0, "Shops cannot be negative"),
});
