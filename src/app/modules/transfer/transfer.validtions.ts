import { z } from "zod";

export const createTransferZodSchema = z.object({
  trackingCode: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Tracking code is required!"
          : "Not a valid string!",
    })
    .optional(),

  message: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Message is required!"
        : "Not a valid string!",
  }),

  requestFrom: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Request From is required!"
          : "Must be a valid ObjectId string!",
    })
    .min(1, "Request From is required!"),

  requestTo: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Request To is required!"
          : "Must be a valid ObjectId string!",
    })
    .min(1, "Request To is required!"),

  shopInfo: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Shop Info is required!"
          : "Must be a valid ObjectId string!",
    })
    .min(1, "Shop Info is required!"),
});
