"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice <= 0)
        return 0;
    return Math.round(((price - salePrice) / price) * 100);
};
const brandAndCategorySchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        // required: [true, "Brand is Required!"],
        ref: "brand",
    },
    categories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, "Category is Required!"],
        ref: "category",
    },
    tags: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, "Tag is Required!"],
        ref: "tag",
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const commissionSchema = new mongoose_1.Schema({
    regularType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
    },
    regularValue: {
        type: Number,
        default: 0, // default commission
    },
    retailType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
    },
    retailValue: {
        type: Number,
        default: 0,
    },
    allowManualOverride: {
        type: Boolean,
        default: false,
    },
}, { _id: false });
const descriptionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"],
    },
    slug: { type: String },
    unit: {
        type: String,
        required: [true, "Unit is Required!"],
    },
    description: {
        type: String,
        required: [true, "A small description is required!"],
    },
    status: {
        type: String,
        enum: ["publish", "draft"],
        required: [true, "Status is required!"],
        default: "draft",
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const externalSchema = new mongoose_1.Schema({
    productUrl: {
        type: String,
    },
    buttonLabel: {
        type: String,
    },
}, { _id: false } // Prevents creating a separate _id for icon
);
const productInfoSchema = new mongoose_1.Schema({
    price: {
        type: Number,
        required: [true, "Price is Required!"],
    },
    salePrice: {
        type: Number,
        required: [true, "Sale price is Required!"],
    },
    retailPrice: {
        type: Number,
    },
    wholeSalePrice: {
        type: Number,
    },
    discount: {
        type: Number,
        default: 0,
    }, // discount in percentage
    quantity: {
        type: Number,
        required: [true, "Quantity is Required!"],
    },
    sku: {
        type: String,
        required: [true, "sku is Required!"],
    },
    width: {
        type: String,
        required: [true, "Width is Required!"],
    },
    height: {
        type: String,
        required: [true, "Height is Required!"],
    },
    length: {
        type: String,
        required: [true, "Length is Required!"],
    },
    isDigital: {
        type: Boolean,
    },
    digital: {
        type: String,
    },
    isExternal: {
        type: Boolean,
    },
    external: externalSchema,
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.Schema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    featuredImg: {
        type: String,
        required: [true, "Feature image is Required!"],
    },
    gallery: {
        type: [String],
        required: [true, "Gallery is Required!"],
        default: [],
    },
    video: {
        type: String,
    },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: {
        type: String,
        enum: ["simple", "variable"],
        required: [true, "Product type is Required!"],
    },
    productInfo: productInfoSchema,
    specifications: [
        {
            key: { type: String },
            value: { type: String },
        },
    ],
    //commission field
    commission: commissionSchema,
}, {
    timestamps: true,
});
// 🔹 Pre-save middleware (for create)
productSchema.pre("save", function (next) {
    var _a, _b;
    const product = this;
    if (((_a = product.productInfo) === null || _a === void 0 ? void 0 : _a.price) && ((_b = product.productInfo) === null || _b === void 0 ? void 0 : _b.salePrice)) {
        product.productInfo.discount = calculateDiscount(product.productInfo.price, product.productInfo.salePrice);
    }
    else {
        product.productInfo.discount = 0;
    }
    next();
});
// 🔹 Pre-findOneAndUpdate middleware (for update)
productSchema.pre("findOneAndUpdate", function (next) {
    var _a, _b;
    const update = this.getUpdate();
    if (((_a = update === null || update === void 0 ? void 0 : update.productInfo) === null || _a === void 0 ? void 0 : _a.price) !== undefined) {
        const price = update.productInfo.price;
        const salePrice = (_b = update.productInfo.salePrice) !== null && _b !== void 0 ? _b : 0;
        update.productInfo.discount = calculateDiscount(price, salePrice);
    }
    this.setUpdate(update);
    next();
});
exports.ProductModel = (0, mongoose_1.model)("product", productSchema);
