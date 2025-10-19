// import { TWithdrawals } from "./withdrawals.interface";
// import { WithdrawalModel } from "./withdrawals.model";

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

import httpStatus from "http-status";
// // import AppError from "../../errors/AppError";
// import { user } from "../user/user.model"; // ✅ Adjust path as needed
import AppError from "../../errors/handleAppError";
import { UserModel } from "../user/user.model";
import { TWithdrawals } from "./withdrawals.interface";
import { WithdrawalModel } from "./withdrawals.model";

// 🔹 Get Withdrawals by User ID (pending + approved)
const getUserWithdrawalsFromDB = async (userId: string) => {
  const result = await WithdrawalModel.find({
    user: userId,
    status: { $in: ["pending", "approved"] },
  }).populate("user");

  return result;
};

// 🔹 Create Withdrawal Request
const createWithdrawalOnDB = async (payload: TWithdrawals) => {
  const user = await UserModel.findById(payload.user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // ✅ Ensure SR cannot withdraw more than available commission
  const availableCommission =
    typeof user.commissionBalance === "number" ? user.commissionBalance : 0;
  if (payload.amount > availableCommission) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Insufficient commission balance!"
    );
  }

  // ✅ Ensure user stays active
  if (user.status !== "active") {
    user.status = "active";
    await user.save();
  }

  // ✅ Create withdrawal (pending by default)
  const result = await WithdrawalModel.create(payload);
  return result;
};
// 🔹 Approve / Update Withdrawal
// const updateWithdrawalOnDB = async (
//   id: string,
//   payload: Partial<TWithdrawals>
// ) => {
//   const withdrawal = await WithdrawalModel.findById(id);
//   if (!withdrawal) {
//     throw new AppError(httpStatus.NOT_FOUND, "Withdrawal not found!");
//   }

//   // ✅ If admin approves the withdrawal, deduct SR’s commission
//   if (payload.status === "approved") {
//     const user = await UserModel.findById(withdrawal.user);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found!");
//     }

//     const availableCommission =
//       typeof user.commissionBalance === "number" ? user.commissionBalance : 0;
//     if (withdrawal.amount > availableCommission) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Insufficient commission balance to approve withdrawal!"
//       );
//     }

//     // Deduct the withdrawn amount
//     user.commissionBalance = availableCommission - withdrawal.amount;
//     await user.save();
//   }

//   const result = await WithdrawalModel.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };

// 🔹 Approve / Update Withdrawal
const updateWithdrawalOnDB = async (
  id: string,
  payload: Partial<TWithdrawals>
) => {
  const withdrawal = await WithdrawalModel.findById(id);
  if (!withdrawal) {
    throw new AppError(httpStatus.NOT_FOUND, "Withdrawal not found!");
  }

  // ✅ If admin approves the withdrawal, deduct SR’s commission
  if (payload.status === "approved") {
    const user = await UserModel.findById(withdrawal.user);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const availableCommission =
      typeof user.commissionBalance === "number" ? user.commissionBalance : 0;

    if (withdrawal.amount > availableCommission) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Insufficient commission balance to approve withdrawal!"
      );
    }

    // 💰 Deduct withdrawn amount safely (without saving full user)
    await UserModel.findByIdAndUpdate(user._id, {
      $inc: { commissionBalance: -withdrawal.amount },
    });
  }

  // ✅ Only update withdrawal document fields
  const result = await WithdrawalModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("user");

  return result;
};

// Other functions remain same
const getWithdrawalsFromDB = async () => {
  const result = await WithdrawalModel.find().populate("user");
  return result;
};

const getSingleWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalModel.findById(id).populate("user");
  return result;
};

const deleteWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalModel.findByIdAndDelete(id);
  return result;
};

export const withdrawalServices = {
  createWithdrawalOnDB,
  getWithdrawalsFromDB,
  getSingleWithdrawalFromDB,
  getUserWithdrawalsFromDB,
  updateWithdrawalOnDB,
  deleteWithdrawalFromDB,
};
