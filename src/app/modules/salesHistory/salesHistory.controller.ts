import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { salesHistoryServices } from "./salesHistory.service";

const getAllSalesHistory = catchAsync(async (req, res) => {
  const result = await salesHistoryServices.getAllSalesHistoryFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales history retrieved successfully!",
    data: result,
  });
});

const getSingleSalesHistory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await salesHistoryServices.getSingleSalesHistoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales history retrieved successfully!",
    data: result,
  });
});

const createSalesHistory = catchAsync(async (req, res) => {
  const salesHistoryData = req.body;
  const result = await salesHistoryServices.createSalesHistoryIntoDB(
    salesHistoryData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales history created successfully!",
    data: result,
  });
});

export const salesHistoryControllers = {
  getAllSalesHistory,
  getSingleSalesHistory,
  createSalesHistory,
};
