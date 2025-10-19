import { z } from "zod";

export const createSalesHistoryZodSchema = z.object({
  history: z
    .array(
      z.object({
        sales: z
          .number({
            error: (issue) =>
              issue.input === undefined
                ? "Sales is required!"
                : "Sales must be a number!",
          })
          .min(0, "Sales cannot be negative"),

        month: z
          .string({
            error: (issue) =>
              issue.input === undefined
                ? "Month is required!"
                : "Month must be a valid date string!",
          })
          .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for month!",
          }),
      }),
      {
        error: () => "Each history item must be a valid object!",
      }
    )
    .nonempty({ message: "At least one history record is required!" }),
});
