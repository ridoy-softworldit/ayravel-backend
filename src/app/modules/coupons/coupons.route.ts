import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { couponControllers } from "./coupons.controller";
import { createCouponZodSchema } from "./coupons.validations";

const router = express.Router();

router.get("/", couponControllers.getAllCoupons);

router.get("/:id", couponControllers.getSingleCoupon);

router.post(
  "/create-coupon",
  validateRequest(createCouponZodSchema),
  couponControllers.createCoupon
);

export const CouponRoutes = router;
