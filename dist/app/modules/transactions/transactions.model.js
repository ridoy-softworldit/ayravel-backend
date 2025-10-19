"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const shippingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Shipping Name is Required!"],
    },
    type: {
        type: String,
        enum: ["free", "percentage", "fixed"],
        required: [true, "Shipping type is Required!"],
    },
    amount: {
        type: Number,
        required: [true, "Shipping amount is Required!"],
    },
}, { _id: false });
const paymentInfoSchema = new mongoose_1.Schema({
    paymentGateway: {
        type: String,
        enum: ["cash-on"],
        required: [true, "Payment gateway is Required!"],
    },
    status: {
        type: Boolean,
        required: [true, "Payment status is Required!"],
    },
}, { _id: false });
const transactionSchema = new mongoose_1.Schema({
    trackingNumber: {
        type: String,
    },
    total: {
        type: Number,
        required: [true, "Total is Required!"],
    },
    productPrice: {
        type: Number,
        required: [true, "Product price is Required!"],
    },
    shipping: shippingSchema,
    tax: {
        type: Number,
        required: [true, "Tax is Required!"],
    },
    discount: {
        type: Number,
        default: 0,
    },
    paymentInfo: paymentInfoSchema,
}, {
    timestamps: true,
});
exports.TransactionModel = (0, mongoose_1.model)("transaction", transactionSchema);
