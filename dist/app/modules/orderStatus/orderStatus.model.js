"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
const mongoose_1 = require("mongoose");
// Schema
const orderStatusSchema = new mongoose_1.Schema({
    statusOf: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: [true, "StatusOf is required!"],
    },
    pending: {
        type: Number,
        default: 0,
        min: [0, "Pending cannot be negative"],
    },
    processing: {
        type: Number,
        default: 0,
        min: [0, "Processing cannot be negative"],
    },
    completed: {
        type: Number,
        default: 0,
        min: [0, "Completed cannot be negative"],
    },
    cancelled: {
        type: Number,
        default: 0,
        min: [0, "Cancelled cannot be negative"],
    },
}, {
    timestamps: true, // createdAt & updatedAt
});
// Model
exports.OrderStatus = (0, mongoose_1.model)("orderStatus", orderStatusSchema);
