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
exports.WithdrawalControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const withdrawals_service_1 = require("./withdrawals.service");
// Create
const createWithdrawal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_service_1.withdrawalServices.createWithdrawalOnDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Withdrawal created successfully!",
        data: result,
    });
}));
// Get all
const getWithdrawals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_service_1.withdrawalServices.getWithdrawalsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdrawals retrieved successfully!",
        data: result,
    });
}));
// Get single
const getSingleWithdrawal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_service_1.withdrawalServices.getSingleWithdrawalFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdrawal retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get withdrawals for specific user
const getUserWithdrawals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield withdrawals_service_1.withdrawalServices.getUserWithdrawalsFromDB(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User withdrawals retrieved successfully!",
        data: result,
    });
}));
// Update
const updateWithdrawal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_service_1.withdrawalServices.updateWithdrawalOnDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdrawal updated successfully!",
        data: result,
    });
}));
// Delete
const deleteWithdrawal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_service_1.withdrawalServices.deleteWithdrawalFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdrawal deleted successfully!",
        data: result,
    });
}));
exports.WithdrawalControllers = {
    createWithdrawal,
    updateWithdrawal,
    deleteWithdrawal,
    getSingleWithdrawal,
    getWithdrawals,
    getUserWithdrawals,
};
