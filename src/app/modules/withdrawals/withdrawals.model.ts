// import { Schema, model } from "mongoose";
// import { TWithdrawals } from "./withdrawals.interface";

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

import { Schema, model } from "mongoose";
import { TWithdrawals } from "./withdrawals.interface";

const withdrawalSchema = new Schema<TWithdrawals>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const WithdrawalModel = model<TWithdrawals>(
  "withdrawal",
  withdrawalSchema
);
