"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModel = void 0;
const mongoose_1 = require("mongoose");
const dashboardSchema = new mongoose_1.Schema({
    summary: { type: mongoose_1.Schema.Types.ObjectId, ref: "summary", required: true },
    orderStatus: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "orderStatus",
        required: true,
    },
    recentOrders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "order", default: [] }],
    salesHistory: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "salesHistory", default: [] },
    ],
    popularProducts: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "product", default: [] },
    ],
    lowStockProducts: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "product", default: [] },
    ],
    topCategoryWithProducts: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "category", default: [] },
    ],
    withdrawals: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "withdrawal", default: [] },
    ],
    attributes: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "attribute", default: [] },
    ],
    taxes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "tax", default: [] }],
    shippings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "shipping", default: [] }],
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "order", default: [] }],
    transactions: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "transaction", default: [] },
    ],
    faqs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "faq", default: [] }],
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user", default: [] }],
    vendors: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "vendor", default: [] }],
    customers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "customer", default: [] }],
    coupons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "coupon", default: [] }],
}, { timestamps: true });
exports.DashboardModel = (0, mongoose_1.model)("dashboard", dashboardSchema);
