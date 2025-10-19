"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxModel = void 0;
const mongoose_1 = require("mongoose");
const taxSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Tax name is required!"],
        trim: true,
    },
    taxRate: {
        type: String,
        required: [true, "Tax rate is required!"],
    },
    country: {
        type: String,
        required: [true, "Country is required!"],
    },
    city: {
        type: String,
        required: [true, "City is required!"],
    },
    state: {
        type: String,
        required: [true, "State is required!"],
    },
    zip: {
        type: String,
        required: [true, "ZIP code is required!"],
    },
}, {
    timestamps: true,
});
// Model
exports.TaxModel = (0, mongoose_1.model)("tax", taxSchema);
