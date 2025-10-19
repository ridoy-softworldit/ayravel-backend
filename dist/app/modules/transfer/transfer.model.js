"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModel = void 0;
const mongoose_1 = require("mongoose");
// Transfer Schema
const transferSchema = new mongoose_1.Schema({
    trackingCode: {
        type: String,
    },
    message: {
        type: String,
        required: [true, "Message is required!"],
    },
    requestFrom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Request From is required!"],
    },
    requestTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Request To is required!"],
    },
    shopInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "shop",
        required: [true, "Shop Info is required!"],
    },
}, { timestamps: true });
exports.TransferModel = (0, mongoose_1.model)("transfer", transferSchema);
