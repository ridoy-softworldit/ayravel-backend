import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { couponServices } from "./coupons.service";

const getAllCoupons = catchAsync(async (req, res) => {
  const result = await couponServices.getAllCouponsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons retrieve successfully!",
    data: result,
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await couponServices.getSingleCouponFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon retrieve successfully!",
    data: result,
  });
});

const createCoupon = catchAsync(async (req, res) => {
  const couponData = req.body;
  const result = await couponServices.createCouponIntoDB(couponData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon created successfully!",
    data: result,
  });
});

export const couponControllers = {
  getAllCoupons,
  getSingleCoupon,
  createCoupon,
};
