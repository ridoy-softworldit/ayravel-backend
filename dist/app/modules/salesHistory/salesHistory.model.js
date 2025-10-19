"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    sales: {
        type: Number,
        required: [true, "Sales value is required!"],
        min: [0, "Sales cannot be negative"],
    },
    month: {
        type: Date,
        required: [true, "Month is required!"],
    },
}, { _id: false });
// Main schema
const salesHistorySchema = new mongoose_1.Schema({
    history: {
        type: [historySchema],
        required: [true, "Sales history is required!"],
        default: [],
    },
}, {
    timestamps: true,
});
// Model
exports.SalesHistoryModel = (0, mongoose_1.model)("salesHistory", salesHistorySchema);
