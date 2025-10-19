"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransferZodSchema = void 0;
const zod_1 = require("zod");
exports.createTransferZodSchema = zod_1.z.object({
    trackingCode: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Tracking code is required!"
            : "Not a valid string!",
    })
        .optional(),
    message: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Message is required!"
            : "Not a valid string!",
    }),
    requestFrom: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Request From is required!"
            : "Must be a valid ObjectId string!",
    })
        .min(1, "Request From is required!"),
    requestTo: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Request To is required!"
            : "Must be a valid ObjectId string!",
    })
        .min(1, "Request To is required!"),
    shopInfo: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Shop Info is required!"
            : "Must be a valid ObjectId string!",
    })
        .min(1, "Shop Info is required!"),
});
