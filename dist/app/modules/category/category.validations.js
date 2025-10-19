"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZodSchema = exports.editIconSchema = exports.createCategoryZodSchema = exports.iconSchema = void 0;
const zod_1 = require("zod");
exports.iconSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Icon name is required!" : "Not a string!",
    }),
    url: zod_1.z.string().optional(),
});
exports.createCategoryZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Category name is required!"
            : "Not a string!",
    }),
    slug: zod_1.z.string().optional(),
    details: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Category description is required!"
            : "Not a string!",
    }),
    icon: exports.iconSchema,
    subCategories: zod_1.z.array(zod_1.z.string()).default([]).optional(),
});
exports.editIconSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    url: zod_1.z.string().url("Invalid icon URL!").optional(),
    image: zod_1.z.string().url("Invalid image URL!").optional(),
    bannerImg: zod_1.z.string().url("Invalid banner image URL!").optional(),
});
exports.updateCategoryZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    details: zod_1.z.string().optional(),
    icon: exports.editIconSchema.optional(),
    subCategories: zod_1.z.array(zod_1.z.string()).default([]),
    image: zod_1.z.string().url("Invalid image URL!").optional(),
    bannerImg: zod_1.z.string().url("Invalid banner image URL!").optional(),
    deletedImages: zod_1.z.array(zod_1.z.string()).optional(),
});
