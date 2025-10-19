"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BecomeSellerReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const becomeSellerReview_controller_1 = require("./becomeSellerReview.controller");
const router = express_1.default.Router();
router.get("/", becomeSellerReview_controller_1.becomeSellerReviewControllers.getAllReviews);
router.get("/:id", becomeSellerReview_controller_1.becomeSellerReviewControllers.getSingleReview);
router.post("/create-review", becomeSellerReview_controller_1.becomeSellerReviewControllers.createReview);
exports.BecomeSellerReviewRoutes = router;
