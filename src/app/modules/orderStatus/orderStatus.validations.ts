import { z } from "zod";

export const createOrderStatusZodSchema = z.object({
  statusOf: z.enum(["daily", "weekly", "monthly", "yearly"], {
    message:
      "statusOf must be one of 'daily', 'weekly', 'monthly', or 'yearly'",
  }),

  pending: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Pending is required!"
          : "Pending must be a number!",
    })
    .min(0, "Pending cannot be negative")
    .default(0)
    .optional(),

  processing: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Processing is required!"
          : "Processing must be a number!",
    })
    .min(0, "Processing cannot be negative")
    .default(0)
    .optional(),

  completed: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Completed is required!"
          : "Completed must be a number!",
    })
    .min(0, "Completed cannot be negative")
    .default(0)
    .optional(),

  cancelled: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Cancelled is required!"
          : "Cancelled must be a number!",
    })
    .min(0, "Cancelled cannot be negative")
    .default(0)
    .optional(),
});
