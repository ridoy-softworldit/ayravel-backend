import { model, Schema } from "mongoose";
import { TBrands } from "./brands.interface";

const iconSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const imagesSchema = new Schema(
  {
    layout: { type: String, enum: ["grid", "slider"], required: true },
    image: { type: String, required: true },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const brandsSchema = new Schema<TBrands>(
  {
    name: {
      type: String,
      required: [true, "Brand can't create without a name!"],
    },
    icon: iconSchema,
    images: [imagesSchema],
  },
  {
    timestamps: true,
  }
);

export const BrandModel = model<TBrands>("brand", brandsSchema);
