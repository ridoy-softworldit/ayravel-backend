import { model, Schema } from "mongoose";
import { TShipping } from "./shipping.interface";

const shippingSchema = new Schema<TShipping>(
  {
    name: {
      type: String,
      required: [true, "Shipping name is required!"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["free", "fixed", "percentage"],
      required: [true, "Shipping type is required!"],
    },
    amount: {
      type: Number,
      required: [true, "Shipping amount is required!"],
      min: [0, "Amount cannot be negative"],
    },
    global: {
      type: String,
      required: [true, "Global value is required!"],
      enum: ["0", "1"],
    },
  },
  {
    timestamps: true,
  }
);

export const ShippingModel = model<TShipping>("shipping", shippingSchema);
