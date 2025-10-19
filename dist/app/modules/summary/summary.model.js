"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryModel = void 0;
const mongoose_1 = require("mongoose");
const summarySchema = new mongoose_1.Schema({
    totalRevenue: {
        type: Number,
        required: [true, "Total revenue is required!"],
        min: [0, "Total revenue cannot be negative"],
    },
    orders: {
        type: Number,
        required: [true, "Orders count is required!"],
        min: [0, "Orders cannot be negative"],
    },
    vendors: {
        type: Number,
        required: [true, "Vendors count is required!"],
        min: [0, "Vendors cannot be negative"],
    },
    shops: {
        type: Number,
        required: [true, "Shops count is required!"],
        min: [0, "Shops cannot be negative"],
    },
}, {
    timestamps: true,
});
// Model
exports.SummaryModel = (0, mongoose_1.model)("summary", summarySchema);
