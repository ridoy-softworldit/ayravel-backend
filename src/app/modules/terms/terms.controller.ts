import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { termsServices } from "./terms.service";

const getAllTerms = catchAsync(async (req, res) => {
  const result = await termsServices.getAllTermsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms retrieved successfully!",
    data: result,
  });
});

const getSingleTerms = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await termsServices.getSingleTermsFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Term retrieved successfully!",
    data: result,
  });
});

const createTerms = catchAsync(async (req, res) => {
  const termsData = req.body;
  const result = await termsServices.createTermsOnDB(termsData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms created successfully!",
    data: result,
  });
});

export const termsControllers = {
  createTerms,
  getSingleTerms,
  getAllTerms,
};
