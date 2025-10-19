import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { summaryServices } from "./summary.service";

// 🔹 Get all summaries
const getAllSummaries = catchAsync(async (req, res) => {
  const result = await summaryServices.getAllSummariesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Summaries retrieved successfully!",
    data: result,
  });
});

// 🔹 Get single summary
const getSingleSummary = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await summaryServices.getSingleSummaryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Summary retrieved successfully!",
    data: result,
  });
});

// 🔹 Create new summary
const createSummary = catchAsync(async (req, res) => {
  const summaryData = req.body;
  const result = await summaryServices.createSummaryIntoDB(summaryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Summary created successfully!",
    data: result,
  });
});

// 🔹 Update summary
const updateSummary = catchAsync(async (req, res) => {
  const id = req.params.id;
  const summaryData = req.body;
  const result = await summaryServices.updateSummaryInDB(id, summaryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Summary updated successfully!",
    data: result,
  });
});

// 🔹 Delete summary
const deleteSummary = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await summaryServices.deleteSummaryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Summary deleted successfully!",
    data: result,
  });
});

export const summaryControllers = {
  getAllSummaries,
  getSingleSummary,
  createSummary,
  updateSummary,
  deleteSummary,
};
