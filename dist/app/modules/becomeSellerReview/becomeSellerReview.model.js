"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BecomeSellerReviewModel = void 0;
const mongoose_1 = require("mongoose");
const userInfoSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "User name is required!"] },
    role: { type: String, required: [true, "User role is required!"] },
    image: { type: String, required: [true, "User image is required!"] },
}, { _id: false });
const becomeSellerReviewSchema = new mongoose_1.Schema({
    rating: { type: Number, required: [true, "Rating is required!"] },
    title: { type: String, required: [true, "Title is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
    userInfo: { type: userInfoSchema, required: true },
}, { timestamps: true });
exports.BecomeSellerReviewModel = (0, mongoose_1.model)("becomeSellerReview", becomeSellerReviewSchema);
