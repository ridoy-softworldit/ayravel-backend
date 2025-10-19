"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrandZodSchema = exports.imageItemSchema = exports.iconSchema = void 0;
const zod_1 = require("zod");
exports.iconSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Icon name is required!" : "Not a string!",
    }),
    url: zod_1.z
        .string({
        error: (issue) => issue.input === undefined ? "Icon URL is required!" : "Not a string!",
    })
        .url("Invalid icon URL!"),
});
exports.imageItemSchema = zod_1.z.object({
    layout: zod_1.z
        .enum(["grid", "slider"])
        .refine((val) => ["grid", "slider"].includes(val), {
        message: "View type must be either 'grid' or 'slider'",
    }),
    image: zod_1.z
        .string({
        error: (issue) => issue.input === undefined ? "Image is required!" : "Not a string!",
    })
        .url("Invalid image URL!"),
});
exports.createBrandZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Brand name is required!" : "Not a string!",
    }),
    icon: exports.iconSchema,
    images: zod_1.z
        .array(exports.imageItemSchema)
        .min(1, { message: "At least one image is required!" }),
});
