import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { withdrawalServices } from "./withdrawals.service";

// Create
const createWithdrawal = catchAsync(async (req, res) => {
  const result = await withdrawalServices.createWithdrawalOnDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdrawal created successfully!",
    data: result,
  });
});

// Get all
const getWithdrawals = catchAsync(async (req, res) => {
  const result = await withdrawalServices.getWithdrawalsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdrawals retrieved successfully!",
    data: result,
  });
});

// Get single
const getSingleWithdrawal = catchAsync(async (req, res) => {
  const result = await withdrawalServices.getSingleWithdrawalFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdrawal retrieved successfully!",
    data: result,
  });
});

// 🔹 Get withdrawals for specific user
const getUserWithdrawals = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await withdrawalServices.getUserWithdrawalsFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User withdrawals retrieved successfully!",
    data: result,
  });
});

// Update
const updateWithdrawal = catchAsync(async (req, res) => {
  const result = await withdrawalServices.updateWithdrawalOnDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdrawal updated successfully!",
    data: result,
  });
});

// Delete
const deleteWithdrawal = catchAsync(async (req, res) => {
  const result = await withdrawalServices.deleteWithdrawalFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Withdrawal deleted successfully!",
    data: result,
  });
});

export const WithdrawalControllers = {
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
  getSingleWithdrawal,
  getWithdrawals,
  getUserWithdrawals,
};
