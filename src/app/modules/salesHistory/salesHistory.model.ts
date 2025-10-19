import { model, Schema } from "mongoose";
import { THistory, TSalesHistory } from "./salesHistory.interface";

const historySchema = new Schema<THistory>(
  {
    sales: {
      type: Number,
      required: [true, "Sales value is required!"],
      min: [0, "Sales cannot be negative"],
    },
    month: {
      type: Date,
      required: [true, "Month is required!"],
    },
  },
  { _id: false }
);

// Main schema
const salesHistorySchema = new Schema<TSalesHistory>(
  {
    history: {
      type: [historySchema],
      required: [true, "Sales history is required!"],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Model
export const SalesHistoryModel = model<TSalesHistory>(
  "salesHistory",
  salesHistorySchema
);
