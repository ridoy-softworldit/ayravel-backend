import { Schema, model, Model } from "mongoose";
import { TAttributes, TAttributesArr } from "./attributes.interface";

const attributesArrSchema = new Schema<TAttributesArr>(
  {
    value: {
      type: String,
      required: [true, "Attribute value is required!"],
    },
    meta: {
      type: String,
      required: [true, "Attribute meta is required!"],
    },
  },
  { _id: false }
);

const attributesSchema = new Schema<TAttributes>(
  {
    name: {
      type: String,
      required: [true, "Attribute name is required!"],
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      lowercase: true,
    },
    attributes: {
      type: [attributesArrSchema],
      required: [true, "Attributes array is required!"],
    },
    type: {
      type: String,
      enum: ["dropdown", "color", "text", "number"],
      default: "dropdown",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const AttributesModel: Model<TAttributes> = model<TAttributes>(
  "attribute",
  attributesSchema
);
