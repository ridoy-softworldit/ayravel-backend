import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { becomeSellerReviewServices } from "./becomeSellerReview.service";

const getAllReviews = catchAsync(async (req, res) => {
  const result = await becomeSellerReviewServices.getAllReviewsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully!",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await becomeSellerReviewServices.getSingleReviewFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review data retrieved successfully!",
    data: result,
  });
});

const createReview = catchAsync(async (req, res) => {
  const reviewData = req.body;
  const result = await becomeSellerReviewServices.createReviewOnDB(reviewData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review created successfully!",
    data: result,
  });
});

export const becomeSellerReviewControllers = {
  getAllReviews,
  getSingleReview,
  createReview,
};
