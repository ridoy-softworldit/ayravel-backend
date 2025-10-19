import { Schema, model } from "mongoose";
import { TOrderStatus } from "./orderStatus.interface";

// Schema
const orderStatusSchema = new Schema<TOrderStatus>(
  {
    statusOf: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "StatusOf is required!"],
    },
    pending: {
      type: Number,
      default: 0,
      min: [0, "Pending cannot be negative"],
    },
    processing: {
      type: Number,
      default: 0,
      min: [0, "Processing cannot be negative"],
    },
    completed: {
      type: Number,
      default: 0,
      min: [0, "Completed cannot be negative"],
    },
    cancelled: {
      type: Number,
      default: 0,
      min: [0, "Cancelled cannot be negative"],
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Model
export const OrderStatus = model<TOrderStatus>(
  "orderStatus",
  orderStatusSchema
);
