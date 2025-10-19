"use strict";
// import { Schema, model } from "mongoose";
// import { TWithdrawals } from "./withdrawals.interface";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalModel = void 0;
// const withdrawalSchema = new Schema<TWithdrawals>(
//   {
//     // shopId: {
//     //   type: Schema.Types.ObjectId,
//     //   required: [true, "Shop ID is required!"],
//     //   ref: "shop",
//     // },
//     amount: {
//       type: Number,
//       required: [true, "Amount is required!"],
//       min: [0, "Amount cannot be negative"],
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["cash-on"],
//       required: [true, "Payment method is required!"],
//     },
//     status: {
//       type: String,
//       enum: ["approved", "on-hold", "processing", "pending", "rejected"],
//       default: "pending",
//       required: [true, "Status is required!"],
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required!"],
//       trim: true,
//     },
//     note: {
//       type: String,
//       required: [true, "Note is required!"],
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );
// export const WithdrawalModel = model<TWithdrawals>(
//   "withdrawal",
//   withdrawalSchema
// );
const mongoose_1 = require("mongoose");
const withdrawalSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required!"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required!"],
        min: [0, "Amount cannot be negative"],
    },
    paymentMethod: {
        type: String,
        enum: ["cash-on"],
        required: [true, "Payment method is required!"],
    },
    status: {
        type: String,
        enum: ["approved", "on-hold", "processing", "pending", "rejected"],
        default: "pending",
        required: [true, "Status is required!"],
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
        trim: true,
    },
    note: {
        type: String,
        required: [true, "Note is required!"],
        trim: true,
    },
}, { timestamps: true });
exports.WithdrawalModel = (0, mongoose_1.model)("withdrawal", withdrawalSchema);
