import { model, Schema } from "mongoose";
import { TTag } from "./tags.interface";

const iconSchema = new Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const tagSchema = new Schema<TTag>(
  {
    name: {
      type: String,
      required: [true, "Tag can't create without a name!"],
    },
    slug: {
      type: String,
    },
    type: {
      type: String,
    },
    details: {
      type: String,
      required: [true, "A short details is required!"],
    },
    icon: iconSchema,
    image: {
      type: String,
      required: [true, "Image url is required!"],
    },
  },
  {
    timestamps: true,
  }
);

export const TagModel = model<TTag>("tag", tagSchema);
