"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String },
}, { _id: false } // Prevents creating a separate _id for icon
);
const tagSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Tag can't create without a name!"],
    },
    slug: {
        type: String,
    },
    type: {
        type: String,
    },
    details: {
        type: String,
        required: [true, "A short details is required!"],
    },
    icon: iconSchema,
    image: {
        type: String,
        required: [true, "Image url is required!"],
    },
}, {
    timestamps: true,
});
exports.TagModel = (0, mongoose_1.model)("tag", tagSchema);
