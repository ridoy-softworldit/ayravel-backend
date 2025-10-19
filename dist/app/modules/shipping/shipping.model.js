"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingModel = void 0;
const mongoose_1 = require("mongoose");
const shippingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Shipping name is required!"],
        trim: true,
    },
    type: {
        type: String,
        enum: ["free", "fixed", "percentage"],
        required: [true, "Shipping type is required!"],
    },
    amount: {
        type: Number,
        required: [true, "Shipping amount is required!"],
        min: [0, "Amount cannot be negative"],
    },
    global: {
        type: String,
        required: [true, "Global value is required!"],
        enum: ["0", "1"],
    },
}, {
    timestamps: true,
});
exports.ShippingModel = (0, mongoose_1.model)("shipping", shippingSchema);
