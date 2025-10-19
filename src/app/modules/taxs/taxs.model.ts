import { model, Schema } from "mongoose";
import { TTax } from "./taxs.interface";

const taxSchema = new Schema<TTax>(
  {
    name: {
      type: String,
      required: [true, "Tax name is required!"],
      trim: true,
    },
    taxRate: {
      type: String,
      required: [true, "Tax rate is required!"],
    },
    country: {
      type: String,
      required: [true, "Country is required!"],
    },
    city: {
      type: String,
      required: [true, "City is required!"],
    },
    state: {
      type: String,
      required: [true, "State is required!"],
    },
    zip: {
      type: String,
      required: [true, "ZIP code is required!"],
    },
  },
  {
    timestamps: true,
  }
);

// Model
export const TaxModel = model<TTax>("tax", taxSchema);
