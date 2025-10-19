"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesModel = void 0;
const mongoose_1 = require("mongoose");
const attributesArrSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: [true, "Attribute value is required!"],
    },
    meta: {
        type: String,
        required: [true, "Attribute meta is required!"],
    },
}, { _id: false });
const attributesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Attribute name is required!"],
        trim: true,
    },
    slug: {
        type: String,
        required: false,
        lowercase: true,
    },
    attributes: {
        type: [attributesArrSchema],
        required: [true, "Attributes array is required!"],
    },
    type: {
        type: String,
        enum: ["dropdown", "color", "text", "number"],
        default: "dropdown",
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "category",
        required: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.AttributesModel = (0, mongoose_1.model)("attribute", attributesSchema);
