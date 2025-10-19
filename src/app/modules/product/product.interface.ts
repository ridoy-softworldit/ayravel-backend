import { Types } from "mongoose";

export type TBrandAndCategories = {
  brand?: Types.ObjectId;
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
};

export type TDescription = {
  name: string;
  slug?: string;
  unit: string;
  description: string;
  status: "publish" | "draft";
};

export type TCommission = {
  regularType: "percentage" | "fixed";
  regularValue: number; // e.g., 5% or 50 taka
  retailType: "percentage" | "fixed";
  retailValue: number; // e.g., 7% or 100 taka
  allowManualOverride?: boolean;
};

export type TExternal = {
  productUrl: string;
  buttonLabel: string;
};

export type TProductInfo = {
  price: number;
  salePrice: number;
  retailPrice?: number;
  wholeSalePrice?: number;
  discount?: number;
  quantity: number;
  sku: string;
  width: string;
  height: string;
  length: string;
  isDigital?: boolean;
  digital?: string;
  isExternal?: boolean;
  external?: TExternal;
};

export type TProduct = {
  shopId?: Types.ObjectId;
  featuredImg: string;
  gallery: string[];
  video?: string;
  brandAndCategories: TBrandAndCategories;
  description: TDescription;
  productType: "simple" | "variable";
  productInfo: TProductInfo;
  specifications?: [{ key: string; value: string }];
  deletedImages?: string[];
  commission?: TCommission;
};
