import { Types } from "mongoose";

export type TBasicInfo = {
  name: string;
  slug: string;
  description: string;
};

export type TPaymentInfo = {
  accountHolderName: string;
  accountHolderEmail: string;
  bankName: string;
  accountNumber: string;
};

export type TShopAddress = {
  country: string;
  city: string;
  state: string;
  zip: string;
  streetAddress: string;
};

export type TEmailNotification = {
  notificationEmail: string;
  isEnabled: boolean;
};

export type TShopSetting = {
  contactNo: string;
  websiteUrl?: string;
};

export type TSocialProfileSetting = {
  platform: string;
  url: string;
};

export type TShopMaintenanceSetting = {
  image: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

export type TShop = {
  vendorId: Types.ObjectId;
  staffs?: Types.ObjectId[];
  logo: string;
  coverImage?: string;
  basicInfo: TBasicInfo;
  paymentInfo?: TPaymentInfo;
  shopAddress: TShopAddress;
  notificationEmail: TEmailNotification;
  shopSetting: TShopSetting;
  shopMaintenanceSetting?: TShopMaintenanceSetting;
  products: Types.ObjectId[];
  orders: Types.ObjectId[];
  commissionRate?: number;
  currentBalance: number;
  transactions: Types.ObjectId[];
  withdrawals: Types.ObjectId[];
  attributes: Types.ObjectId[];
  status: "active" | "inactive" | "pending";
  isApproved: boolean;
  coupons: Types.ObjectId[];
};

export type TShopStatusToggle = {
  updatedBy: Types.ObjectId;
  status: "active" | "inactive" | "pending";
};

export type TShopDeletedBy = {
  deletedBy: Types.ObjectId;
};
