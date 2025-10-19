import express from "express";
import { becomeSellerReviewControllers } from "./becomeSellerReview.controller";

const router = express.Router();

router.get("/", becomeSellerReviewControllers.getAllReviews);

router.get("/:id", becomeSellerReviewControllers.getSingleReview);

router.post("/create-review", becomeSellerReviewControllers.createReview);

export const BecomeSellerReviewRoutes = router;
