"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsAndConditionsZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.termsAndConditionsZodSchema = zod_1.default.object({
    name: zod_1.default.string({
        error: () => "Name is required!",
    }),
    description: zod_1.default.string({
        error: () => "Description is required!",
    }),
    type: zod_1.default.enum(["global", "shops"], {
        message: "Type must be either 'global' or 'shops'",
    }),
    issuedBy: zod_1.default.number({
        error: () => "IssuedBy is required!",
    }),
    isApproved: zod_1.default.boolean().optional(),
});
