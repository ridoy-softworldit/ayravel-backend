"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModel = void 0;
const mongoose_1 = require("mongoose");
// Sub-schemas
const basicInfoSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Shop name is required!"] },
    slug: { type: String, required: [true, "Shop slug is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
}, { _id: false });
const paymentInfoSchema = new mongoose_1.Schema({
    accountHolderName: {
        type: String,
    },
    accountHolderEmail: {
        type: String,
    },
    bankName: { type: String },
    accountNumber: {
        type: String,
    },
}, { _id: false });
const shopAddressSchema = new mongoose_1.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    streetAddress: { type: String, required: true },
}, { _id: false });
const emailNotificationSchema = new mongoose_1.Schema({
    notificationEmail: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
}, { _id: false });
const shopSettingSchema = new mongoose_1.Schema({
    contactNo: {
        type: String,
        required: [true, "Contact number is required!"],
    },
    websiteUrl: { type: String },
}, { _id: false });
const shopMaintenanceSettingSchema = new mongoose_1.Schema({
    image: { type: String },
    title: { type: String },
    description: { type: String },
    startTime: { type: String },
    endTime: { type: String },
}, { _id: false });
const shopSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    staffs: [{ type: mongoose_1.Schema.Types.ObjectId }],
    logo: { type: String, required: true },
    coverImage: { type: String },
    basicInfo: { type: basicInfoSchema, required: true },
    paymentInfo: { type: paymentInfoSchema, default: {} },
    shopAddress: { type: shopAddressSchema, required: true },
    notificationEmail: { type: emailNotificationSchema, required: true },
    shopSetting: { type: shopSettingSchema, required: true },
    shopMaintenanceSetting: {
        type: shopMaintenanceSettingSchema,
        default: {},
    },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "product" }],
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "order" }],
    commissionRate: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "transaction" }],
    withdrawals: [{ type: mongoose_1.Schema.Types.ObjectId }],
    attributes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "attribute" }],
    status: {
        type: String,
        enum: ["active", "inactive", "pending"],
        default: "pending",
    },
    isApproved: { type: Boolean, default: false },
    coupons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "coupon" }],
}, { timestamps: true });
exports.ShopModel = (0, mongoose_1.model)("shop", shopSchema);
