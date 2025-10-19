import { Types } from "mongoose";

export type TNotices = {
  noticeBy?: Types.ObjectId;
  message?: string;
  startTime?: Date;
  endTime?: Date;
  status?: "approved" | "rejected";
};

export type TShortNotices = {
  userId?: Types.ObjectId;
  shopId?: Types.ObjectId;
  storeNotices?: TNotices[];
};

export type TSummery = {
  totalRevenue?: number;
  todaysRevenue?: number;
  todaysRefund?: number;
  totalShop?: number;
};

export type TOrderStatus = {
  pending?: number;
  processing?: number;
  completed?: number;
  cancelled?: number;
};

export type TMonth =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type TSalesHistory = {
  totalSales?: number;
  months?: TMonth;
};

export type TCategoryByProduct = {
  categoryId?: Types.ObjectId;
  categoryName?: string;
  shop?: string;
  totalProducts?: number;
};

export type TVendor = {
  userId: Types.ObjectId;
  shops?: Types.ObjectId;
  shopTransfer?: Types.ObjectId[];
  messages?: Types.ObjectId[];
  storeNotices?: Types.ObjectId[];
  summery: TSummery;
  orderStatus?: TOrderStatus;
  salesHistory?: TSalesHistory;
  topCategoryByProducts?: TCategoryByProduct[];
  status?: "pending" | "approved";
};
