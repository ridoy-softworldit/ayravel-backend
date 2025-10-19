"use strict";
// import { AuthServices } from './auth.service';
// import httpStatus from 'http-status';
// import sendResponse from '../../utils/sendResponse';
// import catchAsync from '../../utils/catchAsync';
// import config from '../../config';
// import { setAuthCookie } from '../../utils/setCookie';
// import { createUserTokens } from '../../utils/createTokens';
// import { TUser } from '../user/user.interface';
// import AppError from '../../errors/handleAppError';
// import { StatusCodes } from 'http-status-codes';
// import { JwtPayload } from 'jsonwebtoken';
// import { userRoles } from '../user/user.const';
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
exports.AuthController = void 0;
// const registerUser = catchAsync(async (req, res) => {
//   const userInfo = {
//     ...req.body,
//     auths: {
//       provider: 'email',
//       providerId: req.body.email,
//     },
//   };
//   const result = await AuthServices.registerUserOnDB(userInfo);
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'User has been registered successfully!',
//     data: result,
//   });
// });
// const loginUser = catchAsync(async (req, res) => {
//   const userInfo = req?.body;
//   const result = await AuthServices.loginUserFromDB(userInfo);
//   const tokenInfo = createUserTokens(result as TUser);
//   setAuthCookie(res, tokenInfo);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User Logged in Successfully!',
//     data: result,
//   });
// });
// const loginUserUsingProvider = catchAsync(async (req, res) => {
//   const userInfo = req?.body;
//   const result = await AuthServices.loginUserUsingProviderFromDB(userInfo);
//   sendResponse(
//     res.cookie('accessToken', result?.accessToken, {
//       httpOnly: true,
//       secure: config.node_env === 'production',
//       sameSite: 'none',
//       maxAge: 24 * 60 * 60 * 1000,
//     }),
//     {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'User Logged in Successfully!',
//       data: result?.user,
//     }
//   );
// });
// const logOutUser = catchAsync(async (req, res) => {
//   const userId = req.params.id;
//   const result = await AuthServices.logoutUserFromDB(userId);
//   res.clearCookie('accessToken', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//   });
//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//   });
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User Logged Out Successfully!',
//     data: result,
//   });
// });
// const googleCallbackController = catchAsync(async (req, res) => {
//   let redirectTo = req.query.state ? (req.query.state as string) : '';
//   if (redirectTo.startsWith('/')) {
//     redirectTo = redirectTo.slice(1);
//   }
//   const user = req.user as TUser;
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
//   }
//   const tokenInfo = createUserTokens(user);
//   setAuthCookie(res, tokenInfo);
//   if (user?.role !== 'customer') {
//     if (redirectTo) {
//       return res.redirect(`${config.FRONTEND_URL}/${redirectTo}`);
//     } else {
//       return res.redirect(`${config.FRONTEND_URL}`);
//     }
//   } else {
//      if (redirectTo) {
//        return res.redirect(`${config.FRONTEND_URL_ADMIN}/${redirectTo}`);
//      } else {
//        return res.redirect(`${config.FRONTEND_URL_ADMIN}`);
//      }
//   }
// });
// const gatMe = catchAsync(async (req, res) => {
//   const decodedUser = req.user;
//   const me = await AuthServices.getMe(decodedUser as JwtPayload);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Data received Successfully!',
//     data: me,
//   });
// });
// export const AuthController = {
//   registerUser,
//   loginUser,
//   logOutUser,
//   loginUserUsingProvider,
//   googleCallbackController,
//   gatMe,
// };
const http_status_1 = __importDefault(require("http-status"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createTokens_1 = require("../../utils/createTokens");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = Object.assign(Object.assign({}, req.body), { auths: {
            provider: "email",
            providerId: req.body.email,
        } });
    const result = yield auth_service_1.AuthServices.registerUserOnDB(userInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: result.status === "pending"
            ? "Registration successful! Please wait for admin approval."
            : "User has been registered successfully!",
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserFromDB(userInfo);
    // If no result returned, respond with unauthorized to avoid null access
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.UNAUTHORIZED,
            message: "Invalid credentials or user not found.",
            data: null,
        });
    }
    // Handle pending or blocked users with friendly messages
    if (result.status === "pending") {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.FORBIDDEN,
            message: "Your account is pending approval. Please wait for admin verification.",
            data: null,
        });
    }
    if (result.status === "blocked") {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.FORBIDDEN,
            message: "Your account has been blocked. Please contact support or admin.",
            data: null,
        });
    }
    const tokenInfo = (0, createTokens_1.createUserTokens)(result);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully!",
        data: result,
    });
}));
const loginUserUsingProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserUsingProviderFromDB(userInfo);
    // Handle pending or blocked users with friendly messages
    if (result.user.status === "pending") {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.FORBIDDEN,
            message: "Your account is pending approval. Please wait for admin verification.",
            data: null,
        });
    }
    if (result.user.status === "blocked") {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.FORBIDDEN,
            message: "Your account has been blocked. Please contact support or admin.",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res.cookie("accessToken", result === null || result === void 0 ? void 0 : result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully!",
        data: result === null || result === void 0 ? void 0 : result.user,
    });
}));
const logOutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield auth_service_1.AuthServices.logoutUserFromDB(userId);
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged out successfully!",
        data: result,
    });
}));
const googleCallbackController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/"))
        redirectTo = redirectTo.slice(1);
    const user = req.user;
    if (!user) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    // Handle pending or blocked status before redirect
    if (user.status === "pending") {
        return res.redirect(`${config_1.default.FRONTEND_URL}/pending-approval`);
    }
    if (user.status === "blocked") {
        return res.redirect(`${config_1.default.FRONTEND_URL}/account-blocked`);
    }
    const tokenInfo = (0, createTokens_1.createUserTokens)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    // Redirect user based on their role
    if ((user === null || user === void 0 ? void 0 : user.role) !== "customer") {
        if (redirectTo) {
            return res.redirect(`${config_1.default.FRONTEND_URL}/${redirectTo}`);
        }
        else {
            return res.redirect(`${config_1.default.FRONTEND_URL}`);
        }
    }
    else {
        if (redirectTo) {
            return res.redirect(`${config_1.default.FRONTEND_URL_ADMIN}/${redirectTo}`);
        }
        else {
            return res.redirect(`${config_1.default.FRONTEND_URL_ADMIN}`);
        }
    }
}));
const gatMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const me = yield auth_service_1.AuthServices.getMe(decodedUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Data received successfully!",
        data: me,
    });
}));
exports.AuthController = {
    registerUser,
    loginUser,
    logOutUser,
    loginUserUsingProvider,
    googleCallbackController,
    gatMe,
};
