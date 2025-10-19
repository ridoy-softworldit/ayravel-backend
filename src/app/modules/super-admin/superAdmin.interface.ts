import { Types } from "mongoose";

export type TSuperAdmin = {
  userId: Types.ObjectId;
  dashboard: Types.ObjectId;
  shops: Types.ObjectId[];
  myShops: Types.ObjectId[];
  products: Types.ObjectId[];
  inventory: Types.ObjectId[];
  brands: Types.ObjectId[];
  termsAndCondition: Types.ObjectId[];
  becomeASeller: Types.ObjectId;
};
