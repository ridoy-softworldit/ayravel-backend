// type TStatus = "approved" | "on-hold" | "processing" | "pending" | "rejected";

// export type TWithdrawals = {
//   // shopId: Types.ObjectId;
//   amount: number;
//   paymentMethod: "cash-on";
//   status: TStatus;
//   description: string;
//   note: string;
// };

import { Types } from "mongoose";

type TStatus = "approved" | "on-hold" | "processing" | "pending" | "rejected";

export type TWithdrawals = {
  user: Types.ObjectId; // SR or user who requests withdrawal
  amount: number;
  paymentMethod: "cash-on";
  status: TStatus;
  description: string;
  note: string;
};
