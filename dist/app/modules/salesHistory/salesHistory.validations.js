"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalesHistoryZodSchema = void 0;
const zod_1 = require("zod");
exports.createSalesHistoryZodSchema = zod_1.z.object({
    history: zod_1.z
        .array(zod_1.z.object({
        sales: zod_1.z
            .number({
            error: (issue) => issue.input === undefined
                ? "Sales is required!"
                : "Sales must be a number!",
        })
            .min(0, "Sales cannot be negative"),
        month: zod_1.z
            .string({
            error: (issue) => issue.input === undefined
                ? "Month is required!"
                : "Month must be a valid date string!",
        })
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for month!",
        }),
    }), {
        error: () => "Each history item must be a valid object!",
    })
        .nonempty({ message: "At least one history record is required!" }),
});
