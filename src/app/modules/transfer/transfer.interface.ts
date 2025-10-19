import { Types } from "mongoose";

export type TTransfer = {
  trackingCode?: string;
  message: string;
  requestFrom: Types.ObjectId;
  requestTo: Types.ObjectId;
  shopInfo: Types.ObjectId;
};
