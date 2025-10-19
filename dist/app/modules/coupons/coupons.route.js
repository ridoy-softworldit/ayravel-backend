"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const coupons_controller_1 = require("./coupons.controller");
const coupons_validations_1 = require("./coupons.validations");
const router = express_1.default.Router();
router.get("/", coupons_controller_1.couponControllers.getAllCoupons);
router.get("/:id", coupons_controller_1.couponControllers.getSingleCoupon);
router.post("/create-coupon", (0, validateRequest_1.default)(coupons_validations_1.createCouponZodSchema), coupons_controller_1.couponControllers.createCoupon);
exports.CouponRoutes = router;
