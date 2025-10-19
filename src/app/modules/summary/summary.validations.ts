import { z } from "zod";

export const createSummaryZodSchema = z.object({
  totalRevenue: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Total revenue is required!"
          : "Total revenue must be a number!",
    })
    .min(0, "Total revenue cannot be negative"),

  orders: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Orders count is required!"
          : "Orders must be a number!",
    })
    .min(0, "Orders cannot be negative"),

  vendors: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Vendors count is required!"
          : "Vendors must be a number!",
    })
    .min(0, "Vendors cannot be negative"),

  shops: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Shops count is required!"
          : "Shops must be a number!",
    })
    .min(0, "Shops cannot be negative"),
});
