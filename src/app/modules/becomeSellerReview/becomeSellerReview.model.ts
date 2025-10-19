import { Schema, model } from "mongoose";
import { TBecomeSellerReview } from "./becomeSellerReview.interface";

const userInfoSchema = new Schema(
  {
    name: { type: String, required: [true, "User name is required!"] },
    role: { type: String, required: [true, "User role is required!"] },
    image: { type: String, required: [true, "User image is required!"] },
  },
  { _id: false }
);

const becomeSellerReviewSchema = new Schema<TBecomeSellerReview>(
  {
    rating: { type: Number, required: [true, "Rating is required!"] },
    title: { type: String, required: [true, "Title is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
    userInfo: { type: userInfoSchema, required: true },
  },
  { timestamps: true }
);

export const BecomeSellerReviewModel = model<TBecomeSellerReview>(
  "becomeSellerReview",
  becomeSellerReviewSchema
);
