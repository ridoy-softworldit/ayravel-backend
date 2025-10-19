"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
const mongoose_1 = require("mongoose");
const summerySchema = new mongoose_1.Schema({
    totalRevenue: { type: Number, default: 0 },
    todaysRevenue: { type: Number, default: 0 },
    todaysRefund: { type: Number, default: 0 },
    totalShop: { type: Number, default: 0 },
}, { _id: false });
const orderStatusSchema = new mongoose_1.Schema({
    pending: { type: Number, default: 0 },
    processing: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
}, { _id: false });
const salesHistorySchema = new mongoose_1.Schema({
    totalSales: { type: Number, default: 0 },
    months: {
        type: String,
        enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        default: "January",
    },
}, { _id: false });
const categoryByProductSchema = new mongoose_1.Schema({
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "category", default: null },
    categoryName: { type: String, default: "" },
    shop: { type: String, default: "" },
    totalProducts: { type: Number, default: 0 },
}, { _id: false });
const vendorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "UserId is required!"],
    },
    shops: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "shop",
        default: null,
    },
    shopTransfer: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "transfer",
            default: null,
        },
    ],
    messages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "message",
            default: null,
        },
    ],
    storeNotices: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "notice",
            default: null,
        },
    ],
    summery: { type: summerySchema, default: {} },
    orderStatus: { type: orderStatusSchema, default: {} },
    salesHistory: { type: [salesHistorySchema], default: [] },
    topCategoryByProducts: { type: [categoryByProductSchema], default: [] },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
    },
}, { timestamps: true });
exports.VendorModel = (0, mongoose_1.model)("vendor", vendorSchema);
