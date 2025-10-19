"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqModel = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "FAQ title is required!"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "FAQ description is required!"],
    },
    type: {
        type: String,
        enum: ["global", "shop"],
        required: [true, "FAQ type is required!"],
    },
    issuedBy: {
        type: String,
        required: [true, "IssuedBy is required!"],
    },
}, {
    timestamps: true,
});
exports.FaqModel = (0, mongoose_1.model)("faq", faqSchema);
