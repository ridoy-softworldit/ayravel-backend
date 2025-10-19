import { Schema, model } from "mongoose";
import { TDashboard } from "./dashboard.interface";

const dashboardSchema = new Schema<TDashboard>(
  {
    summary: { type: Schema.Types.ObjectId, ref: "summary", required: true },
    orderStatus: {
      type: Schema.Types.ObjectId,
      ref: "orderStatus",
      required: true,
    },
    recentOrders: [{ type: Schema.Types.ObjectId, ref: "order", default: [] }],
    salesHistory: [
      { type: Schema.Types.ObjectId, ref: "salesHistory", default: [] },
    ],
    popularProducts: [
      { type: Schema.Types.ObjectId, ref: "product", default: [] },
    ],
    lowStockProducts: [
      { type: Schema.Types.ObjectId, ref: "product", default: [] },
    ],
    topCategoryWithProducts: [
      { type: Schema.Types.ObjectId, ref: "category", default: [] },
    ],
    withdrawals: [
      { type: Schema.Types.ObjectId, ref: "withdrawal", default: [] },
    ],
    attributes: [
      { type: Schema.Types.ObjectId, ref: "attribute", default: [] },
    ],
    taxes: [{ type: Schema.Types.ObjectId, ref: "tax", default: [] }],
    shippings: [{ type: Schema.Types.ObjectId, ref: "shipping", default: [] }],
    orders: [{ type: Schema.Types.ObjectId, ref: "order", default: [] }],
    transactions: [
      { type: Schema.Types.ObjectId, ref: "transaction", default: [] },
    ],
    faqs: [{ type: Schema.Types.ObjectId, ref: "faq", default: [] }],
    users: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor", default: [] }],
    customers: [{ type: Schema.Types.ObjectId, ref: "customer", default: [] }],
    coupons: [{ type: Schema.Types.ObjectId, ref: "coupon", default: [] }],
  },
  { timestamps: true }
);

export const DashboardModel = model<TDashboard>("dashboard", dashboardSchema);
