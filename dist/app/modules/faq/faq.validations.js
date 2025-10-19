"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFaqZodSchema = void 0;
const zod_1 = require("zod");
exports.createFaqZodSchema = zod_1.z.object({
    title: zod_1.z.string({
        error: () => "Title is required!",
    }),
    description: zod_1.z.string({
        error: () => "Description is required!",
    }),
    type: zod_1.z.enum(["global", "shop"], {
        message: "Type must be either 'global' or 'shop'",
    }),
    issuedBy: zod_1.z.string({
        error: () => "IssuedBy is required!",
    }),
});
