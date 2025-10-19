import { Types } from "mongoose";

export type TDashboard = {
  summary: Types.ObjectId;
  orderStatus: Types.ObjectId;
  recentOrders: Types.ObjectId[];
  salesHistory: Types.ObjectId[];
  popularProducts: Types.ObjectId[];
  lowStockProducts: Types.ObjectId[];
  topCategoryWithProducts: Types.ObjectId[];
  withdrawals: Types.ObjectId[];
  attributes: Types.ObjectId[];
  taxes: Types.ObjectId[];
  shippings: Types.ObjectId[];
  orders: Types.ObjectId[];
  transactions: Types.ObjectId[];
  faqs: Types.ObjectId[];
  users: Types.ObjectId[];
  vendors: Types.ObjectId[];
  customers: Types.ObjectId[];
  coupons: Types.ObjectId[];
};
