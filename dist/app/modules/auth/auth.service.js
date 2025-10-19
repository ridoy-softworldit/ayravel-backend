"use strict";
// import config from '../../config';
// import { UserModel } from '../user/user.model';
// import { TAuth, TExternalProviderAuth } from './auth.interface';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import AppError from '../../errors/handleAppError';
// import httpStatus from 'http-status';
// import { StatusCodes } from 'http-status-codes';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
// //register a user in database
// const registerUserOnDB = async (payload: TAuth) => {
//   const result = await UserModel.create(payload);
//   return result;
// };
// //login an user with credentials
// const loginUserFromDB = async (payload: TAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });
//   if (!isUserExists) {
//     throw Error('User does not exists!');
//   }
//   if (!isUserExists?.password) {
//     throw new Error(
//       'This account is registered via Google login. Please use Google login.'
//     );
//   }
//   if (!payload?.password) {
//     throw new Error('Password is required');
//   }
//   const isPasswordMatched = await bcrypt.compare(
//     payload.password,
//     isUserExists.password
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Wrong Credentials!');
//   }
//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );
//   return user;
// };
// //login an user with credentials
// const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });
//   // Check if a user exists with the provided email
//   if (!isUserExists) {
//     const result = await UserModel.create(payload);
//     const jwtPayload = {
//       email: result?.email,
//       role: result?.role,
//     };
//     //token
//     const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//       expiresIn: '24h',
//     });
//     const userObject = {
//       user: result,
//       accessToken: token,
//     };
//     return userObject;
//   }
//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );
//   //generating token
//   const jwtPayload = {
//     email: isUserExists?.email,
//     role: isUserExists?.role,
//   };
//   //token
//   const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//     expiresIn: '24h',
//   });
//   const userObject = {
//     user: user,
//     accessToken: token,
//   };
//   return userObject;
// };
// //logout current user and removing token from cookie
// const logoutUserFromDB = async (id: string) => {
//   await UserModel.findByIdAndUpdate(id, { status: 'inActive' }, { new: true });
//   return {};
// };
// const getMe = async (decodedUser: JwtPayload) => {
//   const me = await UserModel.findById(decodedUser.userId).select('-password');
//   if (!me) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//   }
//   return me;
// };
// export const AuthServices = {
//   registerUserOnDB,
//   loginUserFromDB,
//   logoutUserFromDB,
//   loginUserUsingProviderFromDB,
//   getMe,
// };
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const user_model_1 = require("../user/user.model");
/**
 * Register user in the database
 * Sets default status based on user role:
 * - 'active' for customer, admin, super-admin
 * - 'pending' for others
 */
const registerUserOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Determine user status based on role
    const activeRoles = ["customer", "admin", "super-admin"];
    const role = payload.role || "customer";
    const status = activeRoles.includes(role) ? "active" : "pending";
    const userData = Object.assign(Object.assign({}, payload), { role,
        status });
    const result = yield user_model_1.UserModel.create(userData);
    return result;
});
/**
 * Login a user using email/password
 */
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
    });
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    if (!(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "This account is registered via Google login. Please use Google login.");
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.password)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, isUserExists.password);
    if (!isPasswordMatched) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Wrong Credentials!");
    }
    // Prevent login if user is pending or blocked
    if (isUserExists.status === "pending") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is under review. Please wait for approval.");
    }
    if (isUserExists.status === "blocked") {
        throw new handleAppError_1.default(http_status_1.default.FORBIDDEN, "Your account is blocked. Contact support.");
    }
    // Update status to active on successful login
    const user = yield user_model_1.UserModel.findByIdAndUpdate(isUserExists._id, { status: "active" }, { new: true });
    return user;
});
/**
 * Login or register user via external providers (e.g. Google)
 */
const loginUserUsingProviderFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!isUserExists) {
        // Determine user status for new provider accounts
        const activeRoles = ["customer", "admin", "super-admin"];
        const role = payload.role || "customer";
        const status = activeRoles.includes(role) ? "active" : "pending";
        const result = yield user_model_1.UserModel.create(Object.assign(Object.assign({}, payload), { role, status }));
        const jwtPayload = {
            userId: result._id,
            email: result.email,
            role: result.role,
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
            expiresIn: "24h",
        });
        return {
            user: result,
            accessToken: token,
        };
    }
    // Check existing user’s status before allowing login
    if (isUserExists.status === "pending") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is under review. Please wait for approval.");
    }
    if (isUserExists.status === "blocked") {
        throw new handleAppError_1.default(http_status_1.default.FORBIDDEN, "Your account is blocked. Contact support.");
    }
    const user = yield user_model_1.UserModel.findByIdAndUpdate(isUserExists._id, { status: "active" }, { new: true });
    if (!user) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found after update");
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "24h",
    });
    return {
        user,
        accessToken: token,
    };
});
/**
 * Logout user and mark as inactive
 */
const logoutUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.UserModel.findByIdAndUpdate(id, { status: "inactive" }, { new: true });
    return {};
});
/**
 * Get current user info using decoded JWT
 */
const getMe = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const me = yield user_model_1.UserModel.findById(decodedUser.userId).select("-password");
    if (!me) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return me;
});
exports.AuthServices = {
    registerUserOnDB,
    loginUserFromDB,
    logoutUserFromDB,
    loginUserUsingProviderFromDB,
    getMe,
};
