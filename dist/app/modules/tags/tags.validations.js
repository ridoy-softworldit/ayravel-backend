"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTagZodSchema = exports.updateiconSchema = exports.createTagZodSchema = exports.iconSchema = void 0;
const zod_1 = require("zod");
exports.iconSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Icon name is required!" : "Not a string!",
    }),
    url: zod_1.z.string().optional(),
});
exports.createTagZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Tag name is required!" : "Not a string!",
    }),
    slug: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    details: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "A short detail is required!"
            : "Not a string!",
    }),
    icon: exports.iconSchema,
    image: zod_1.z
        .string({
        error: (issue) => issue.input === undefined ? "Image URL is required!" : "Not a string!",
    })
        .url("Invalid image URL!"),
});
exports.updateiconSchema = zod_1.z.object({
    name: zod_1.z.string(),
    url: zod_1.z.string().url("Invalid icon URL!"),
});
exports.updateTagZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    details: zod_1.z.string().optional(),
    icon: exports.updateiconSchema.optional(),
    image: zod_1.z.string().url("Invalid image URL!").optional(),
});
