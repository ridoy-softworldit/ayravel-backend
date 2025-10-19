import AppError from "../../errors/handleAppError";
import { TBecomeSellerReview } from "./becomeSellerReview.interface";
import { BecomeSellerReviewModel } from "./becomeSellerReview.model";
import httpStatus from "http-status";

const getAllReviewsFromDB = async () => {
  const result = await BecomeSellerReviewModel.find();
  return result;
};

const getSingleReviewFromDB = async (id: string) => {
  const result = await BecomeSellerReviewModel.findById(id);
  return result;
};

const createReviewOnDB = async (payload: TBecomeSellerReview) => {
  const isReviewExists = await BecomeSellerReviewModel.findOne({
    title: payload?.title,
    "userInfo.name": payload?.userInfo?.name,
  });

  if (isReviewExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Review Already Exists by this user!"
    );
  }

  const result = await BecomeSellerReviewModel.create(payload);
  return result;
};

export const becomeSellerReviewServices = {
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  createReviewOnDB,
};
