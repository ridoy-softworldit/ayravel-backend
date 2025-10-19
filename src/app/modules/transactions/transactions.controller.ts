import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { transactionServices } from "./transactions.service";

const getAllTransaction = catchAsync(async (req, res) => {
  const result = await transactionServices.getAllTransactionsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transactions retrieve successfully!",
    data: result,
  });
});

const getSingleTransaction = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await transactionServices.getSingleTransactionFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transaction retrieve successfully!",
    data: result,
  });
});

const createTransaction = catchAsync(async (req, res) => {
  const transactionData = req.body;
  const result = await transactionServices.createTransactionOnDB(
    transactionData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transaction created successfully!",
    data: result,
  });
});

export const transactionControllers = {
  createTransaction,
  getSingleTransaction,
  getAllTransaction,
};
