"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const registerUser = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, "Name is required to create a user!")
        .max(40, "Name must be less than 40 characters!"),
    email: zod_1.default
        .string()
        .email("Invalid email format!")
        .min(1, "Email is required to create a user!")
        .max(50, "Email must be less than 50 characters!"),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters long!")
        .max(20, "Password must be less than 20 characters!"),
});
const loginUser = zod_1.default.object({
    email: zod_1.default
        .string()
        .email("Invalid email format!")
        .min(1, "Email is required to create a user!")
        .max(50, "Email must be less than 50 characters!"),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters long!")
        .max(20, "Password must be less than 20 characters!"),
});
const loginUserUsingProvider = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, "Name is required to create a user!")
        .max(40, "Name must be less than 40 characters!"),
    email: zod_1.default
        .string()
        .email("Invalid email format!")
        .min(1, "Email is required to create a user!")
        .max(50, "Email must be less than 50 characters!"),
});
exports.AuthValidations = {
    registerUser,
    loginUser,
    loginUserUsingProvider,
};
