import { model, Schema } from "mongoose";
import { TSummary } from "./summary.interface";

const summarySchema = new Schema<TSummary>(
  {
    totalRevenue: {
      type: Number,
      required: [true, "Total revenue is required!"],
      min: [0, "Total revenue cannot be negative"],
    },
    orders: {
      type: Number,
      required: [true, "Orders count is required!"],
      min: [0, "Orders cannot be negative"],
    },
    vendors: {
      type: Number,
      required: [true, "Vendors count is required!"],
      min: [0, "Vendors cannot be negative"],
    },
    shops: {
      type: Number,
      required: [true, "Shops count is required!"],
      min: [0, "Shops cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Model
export const SummaryModel = model<TSummary>("summary", summarySchema);
