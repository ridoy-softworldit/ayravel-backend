"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttributesZodSchema = exports.createAttributesZodSchema = exports.attributeItemSchema = void 0;
const zod_1 = require("zod");
exports.attributeItemSchema = zod_1.z.object({
    value: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Attribute value is required!"
            : "Not a string!",
    }),
    meta: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Attribute meta is required!"
            : "Not a string!",
    }),
});
exports.createAttributesZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Attribute name is required!"
            : "Not a string!",
    }),
    slug: zod_1.z.string().optional(),
    attributes: zod_1.z
        .array(exports.attributeItemSchema)
        .min(1, { message: "At least one attribute is required!" }),
});
exports.updateAttributesZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: issue => issue.input === undefined
            ? 'Attribute name is required!'
            : 'Not a string!',
    }),
    slug: zod_1.z.string().optional(),
    attributes: zod_1.z
        .array(exports.attributeItemSchema)
        .min(1, { message: 'At least one attribute is required!' }),
});
