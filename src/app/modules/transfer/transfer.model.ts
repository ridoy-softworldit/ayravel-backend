import { Schema, model } from "mongoose";
import { TTransfer } from "./transfer.interface";

// Transfer Schema
const transferSchema = new Schema<TTransfer>(
  {
    trackingCode: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Message is required!"],
    },
    requestFrom: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Request From is required!"],
    },
    requestTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Request To is required!"],
    },
    shopInfo: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: [true, "Shop Info is required!"],
    },
  },
  { timestamps: true }
);

export const TransferModel = model<TTransfer>("transfer", transferSchema);
