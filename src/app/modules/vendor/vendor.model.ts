import { model, Schema } from "mongoose";
import {
  TVendor,
  TOrderStatus,
  TSalesHistory,
  TCategoryByProduct,
  TSummery,
} from "./vendor.interface";

const summerySchema = new Schema<TSummery>(
  {
    totalRevenue: { type: Number, default: 0 },
    todaysRevenue: { type: Number, default: 0 },
    todaysRefund: { type: Number, default: 0 },
    totalShop: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderStatusSchema = new Schema<TOrderStatus>(
  {
    pending: { type: Number, default: 0 },
    processing: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
  },
  { _id: false }
);

const salesHistorySchema = new Schema<TSalesHistory>(
  {
    totalSales: { type: Number, default: 0 },
    months: {
      type: String,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      default: "January",
    },
  },
  { _id: false }
);

const categoryByProductSchema = new Schema<TCategoryByProduct>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "category", default: null },
    categoryName: { type: String, default: "" },
    shop: { type: String, default: "" },
    totalProducts: { type: Number, default: 0 },
  },
  { _id: false }
);

const vendorSchema = new Schema<TVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "UserId is required!"],
    },
    shops: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      default: null,
    },
    shopTransfer: [
      {
        type: Schema.Types.ObjectId,
        ref: "transfer",
        default: null,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
        default: null,
      },
    ],
    storeNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "notice",
        default: null,
      },
    ],
    summery: { type: summerySchema, default: {} },
    orderStatus: { type: orderStatusSchema, default: {} },
    salesHistory: { type: [salesHistorySchema], default: [] },
    topCategoryByProducts: { type: [categoryByProductSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const VendorModel = model<TVendor>("vendor", vendorSchema);
