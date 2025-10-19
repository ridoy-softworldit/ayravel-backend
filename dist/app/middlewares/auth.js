"use strict";
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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const handleAppError_1 = __importDefault(require("../errors/handleAppError"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = ((_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("=")[1]) || "";
        if (!token) {
            throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized !");
        }
        let decoded = {};
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new handleAppError_1.default(401, "Unauthorized !");
        }
        const role = decoded.role;
        const user = yield user_model_1.UserModel.findOne({ email: decoded === null || decoded === void 0 ? void 0 : decoded.email });
        if (!user) {
            throw new handleAppError_1.default(404, "The user is not found !");
        }
        const isDeleted = String(user === null || user === void 0 ? void 0 : user.status) === "banned";
        if (isDeleted) {
            throw new handleAppError_1.default(400, "The user is banned !");
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized !");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
