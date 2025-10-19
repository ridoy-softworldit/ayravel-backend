import { model, Schema } from "mongoose";
import { TCoupon } from "./coupons.interface";

const couponSchema = new Schema<TCoupon>(
  {
    image: {
      type: String,
      required: [true, "Image is Required!"],
    },
    code: {
      type: String,
      required: [true, "Code is Required!"],
    },
    description: {
      type: String,
      required: [true, "Description is Required!"],
    },
    type: {
      type: String,
      enum: ["fixed", "percentage", "fixed"],
      required: [true, "Type is Required!"],
    },
    discountAmount: {
      type: Number,
      required: [true, "A discount amount is Required!"],
    },
    isVerifiedCustomer: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    activeDate: {
      type: Date,
      required: [true, "Active date is Required!"],
    },
    expireDate: {
      type: Date,
      required: [true, "Expire date is Required!"],
    },
  },
  {
    timestamps: true,
  }
);

export const CouponModel = model<TCoupon>("coupon", couponSchema);
