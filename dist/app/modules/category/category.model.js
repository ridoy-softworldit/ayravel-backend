"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String },
}, { _id: false } // Prevents creating a separate _id for icon
);
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category can't create without a name!"],
    },
    slug: {
        type: String,
    },
    details: {
        type: String,
        required: [true, "Category need a description!"],
    },
    icon: iconSchema,
    image: {
        type: String,
        // required: [true, "An image is required to create category!"],
    },
    bannerImg: {
        type: String,
        required: [true, "A banner image is required to create category!"],
    },
    subCategories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "category",
    },
}, {
    timestamps: true,
});
exports.CategoryModel = (0, mongoose_1.model)("category", categorySchema);
