"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsModel = void 0;
const mongoose_1 = require("mongoose");
// Sub-schema for Terms & Conditions
const termsAndConditionsSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Name is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
    type: {
        type: String,
        enum: ["global", "shops"],
        required: [true, "Type is required!"],
    },
    issuedBy: { type: Number, required: [true, "IssuedBy is required!"] },
    isApproved: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.TermsModel = (0, mongoose_1.model)("terms", termsAndConditionsSchema);
