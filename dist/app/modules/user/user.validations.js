"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_const_1 = require("./user.const");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    role: zod_1.z.enum([...user_const_1.userRoles]).optional(),
    image: zod_1.z.string().optional(),
    gender: zod_1.z.enum([...user_const_1.possibleGenders]).optional(),
    contactNo: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    status: zod_1.z.enum([...user_const_1.userStatus]).optional(),
    walletPoint: zod_1.z.number().optional(),
    socials: zod_1.z.array(zod_1.z.string()).optional(),
    cardInfo: zod_1.z.any().optional().nullable(),
});
