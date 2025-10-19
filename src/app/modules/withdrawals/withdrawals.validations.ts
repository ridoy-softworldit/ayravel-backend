import { z } from "zod";

// 🔹 Withdrawals Validation Schema
export const createWithdrawalZodSchema = z.object({
  // shopId: z.string({
  //   error: (issue) =>
  //     issue.input === undefined ? "Shop ID is required!" : "Not a string!",
  // }),

  amount: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Amount is required!" : "Not a number!",
    })
    .min(1, "Amount must be greater than 0!"),

  paymentMethod: z.enum(["cash-on"], {
    message: "Payment method must be 'cash-on'!",
  }),

  status: z.enum(["approved", "on-hold", "processing", "pending", "rejected"], {
    message:
      "Status must be one of: approved | on-hold | processing | pending | rejected",
  }),

  description: z.string({
    error: (issue) =>
      issue.input === undefined ? "Description is required!" : "Not a string!",
  }),

  note: z.string({
    error: (issue) =>
      issue.input === undefined ? "Note is required!" : "Not a string!",
  }),
});
