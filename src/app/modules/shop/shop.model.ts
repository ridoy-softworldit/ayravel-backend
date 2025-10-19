import { Schema, model } from "mongoose";
import {
  TBasicInfo,
  TEmailNotification,
  TPaymentInfo,
  TShop,
  TShopAddress,
  TShopMaintenanceSetting,
  TShopSetting,
} from "./shop.interface";

// Sub-schemas
const basicInfoSchema = new Schema<TBasicInfo>(
  {
    name: { type: String, required: [true, "Shop name is required!"] },
    slug: { type: String, required: [true, "Shop slug is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
  },
  { _id: false }
);

const paymentInfoSchema = new Schema<TPaymentInfo>(
  {
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
  },
  { _id: false }
);

const shopAddressSchema = new Schema<TShopAddress>(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    streetAddress: { type: String, required: true },
  },
  { _id: false }
);

const emailNotificationSchema = new Schema<TEmailNotification>(
  {
    notificationEmail: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const shopSettingSchema = new Schema<TShopSetting>(
  {
    contactNo: {
      type: String,
      required: [true, "Contact number is required!"],
    },
    websiteUrl: { type: String },
  },
  { _id: false }
);

const shopMaintenanceSettingSchema = new Schema<TShopMaintenanceSetting>(
  {
    image: { type: String },
    title: { type: String },
    description: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false }
);

const shopSchema = new Schema<TShop>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    staffs: [{ type: Schema.Types.ObjectId }],
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
    products: [{ type: Schema.Types.ObjectId, ref: "product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
    commissionRate: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    transactions: [{ type: Schema.Types.ObjectId, ref: "transaction" }],
    withdrawals: [{ type: Schema.Types.ObjectId }],
    attributes: [{ type: Schema.Types.ObjectId, ref: "attribute" }],
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    isApproved: { type: Boolean, default: false },
    coupons: [{ type: Schema.Types.ObjectId, ref: "coupon" }],
  },
  { timestamps: true }
);

export const ShopModel = model<TShop>("shop", shopSchema);
