"use strict";
// import { TWithdrawals } from "./withdrawals.interface";
// import { WithdrawalModel } from "./withdrawals.model";
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
exports.withdrawalServices = void 0;
// const createWithdrawalOnDB = async (payload: TWithdrawals) => {
//   const result = await WithdrawalModel.create(payload);
//   return result;
// };
// const getWithdrawalsFromDB = async () => {
//   const result = await WithdrawalModel.find().populate("shopId");
//   return result;
// };
// const getSingleWithdrawalFromDB = async (id: string) => {
//   const result = await WithdrawalModel.findById(id).populate("shopId");
//   return result;
// };
// const updateWithdrawalOnDB = async (
//   id: string,
//   payload: Partial<TWithdrawals>
// ) => {
//   const result = await WithdrawalModel.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
// const deleteWithdrawalFromDB = async (id: string) => {
//   const result = await WithdrawalModel.findByIdAndDelete(id);
//   return result;
// };
// export const withdrawalServices = {
//   createWithdrawalOnDB,
//   getWithdrawalsFromDB,
//   getSingleWithdrawalFromDB,
//   updateWithdrawalOnDB,
//   deleteWithdrawalFromDB,
// };
const http_status_1 = __importDefault(require("http-status"));
// // import AppError from "../../errors/AppError";
// import { user } from "../user/user.model"; // ✅ Adjust path as needed
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const user_model_1 = require("../user/user.model");
const withdrawals_model_1 = require("./withdrawals.model");
// 🔹 Get Withdrawals by User ID (pending + approved)
const getUserWithdrawalsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.find({
        user: userId,
        status: { $in: ["pending", "approved"] },
    }).populate("user");
    return result;
});
// 🔹 Create Withdrawal Request
const createWithdrawalOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(payload.user);
    if (!user) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // ✅ Ensure SR cannot withdraw more than available commission
    const availableCommission = typeof user.commissionBalance === "number" ? user.commissionBalance : 0;
    if (payload.amount > availableCommission) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient commission balance!");
    }
    // ✅ Ensure user stays active
    if (user.status !== "active") {
        user.status = "active";
        yield user.save();
    }
    // ✅ Create withdrawal (pending by default)
    const result = yield withdrawals_model_1.WithdrawalModel.create(payload);
    return result;
});
// 🔹 Approve / Update Withdrawal
const updateWithdrawalOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const withdrawal = yield withdrawals_model_1.WithdrawalModel.findById(id);
    if (!withdrawal) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Withdrawal not found!");
    }
    // ✅ If admin approves the withdrawal, deduct SR’s commission
    if (payload.status === "approved") {
        const user = yield user_model_1.UserModel.findById(withdrawal.user);
        if (!user) {
            throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        const availableCommission = typeof user.commissionBalance === "number" ? user.commissionBalance : 0;
        if (withdrawal.amount > availableCommission) {
            throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient commission balance to approve withdrawal!");
        }
        // Deduct the withdrawn amount
        user.commissionBalance = availableCommission - withdrawal.amount;
        yield user.save();
    }
    const result = yield withdrawals_model_1.WithdrawalModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Other functions remain same
const getWithdrawalsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.find().populate("user");
    return result;
});
const getSingleWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.findById(id).populate("user");
    return result;
});
const deleteWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.WithdrawalModel.findByIdAndDelete(id);
    return result;
});
exports.withdrawalServices = {
    createWithdrawalOnDB,
    getWithdrawalsFromDB,
    getSingleWithdrawalFromDB,
    getUserWithdrawalsFromDB,
    updateWithdrawalOnDB,
    deleteWithdrawalFromDB,
};
