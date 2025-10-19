"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const config_1 = __importDefault(require("../config"));
const jwt_1 = require("./jwt");
const createUserTokens = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    // ✅ Use fallback or explicit runtime check
    const accessSecret = config_1.default.jwt_access_secret || "";
    const refreshSecret = config_1.default.JWT_REFRESH_SECRET || "";
    if (!accessSecret || !refreshSecret) {
        throw new Error("JWT secrets are not defined in environment variables");
    }
    const accessToken = (0, jwt_1.generateToken)(payload, accessSecret, config_1.default.JWT_ACCESS_EXPIRES || "1d");
    const refreshToken = (0, jwt_1.generateToken)(payload, refreshSecret, config_1.default.JWT_REFRESH_EXPIRES || "7d");
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
