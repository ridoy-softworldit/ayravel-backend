"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithdrawalZodSchema = void 0;
const zod_1 = require("zod");
// 🔹 Withdrawals Validation Schema
exports.createWithdrawalZodSchema = zod_1.z.object({
    // shopId: z.string({
    //   error: (issue) =>
    //     issue.input === undefined ? "Shop ID is required!" : "Not a string!",
    // }),
    amount: zod_1.z
        .number({
        error: (issue) => issue.input === undefined ? "Amount is required!" : "Not a number!",
    })
        .min(1, "Amount must be greater than 0!"),
    paymentMethod: zod_1.z.enum(["cash-on"], {
        message: "Payment method must be 'cash-on'!",
    }),
    status: zod_1.z.enum(["approved", "on-hold", "processing", "pending", "rejected"], {
        message: "Status must be one of: approved | on-hold | processing | pending | rejected",
    }),
    description: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Description is required!" : "Not a string!",
    }),
    note: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Note is required!" : "Not a string!",
    }),
});
