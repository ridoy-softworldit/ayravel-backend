"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderStatusZodSchema = void 0;
const zod_1 = require("zod");
exports.createOrderStatusZodSchema = zod_1.z.object({
    statusOf: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"], {
        message: "statusOf must be one of 'daily', 'weekly', 'monthly', or 'yearly'",
    }),
    pending: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Pending is required!"
            : "Pending must be a number!",
    })
        .min(0, "Pending cannot be negative")
        .default(0)
        .optional(),
    processing: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Processing is required!"
            : "Processing must be a number!",
    })
        .min(0, "Processing cannot be negative")
        .default(0)
        .optional(),
    completed: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Completed is required!"
            : "Completed must be a number!",
    })
        .min(0, "Completed cannot be negative")
        .default(0)
        .optional(),
    cancelled: zod_1.z
        .number({
        error: (issue) => issue.input === undefined
            ? "Cancelled is required!"
            : "Cancelled must be a number!",
    })
        .min(0, "Cancelled cannot be negative")
        .default(0)
        .optional(),
});
