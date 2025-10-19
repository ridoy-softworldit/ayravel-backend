import { Schema, model } from "mongoose";
import { TFaq } from "./faq.interface";

const faqSchema = new Schema<TFaq>(
  {
    title: {
      type: String,
      required: [true, "FAQ title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "FAQ description is required!"],
    },
    type: {
      type: String,
      enum: ["global", "shop"],
      required: [true, "FAQ type is required!"],
    },
    issuedBy: {
      type: String,
      required: [true, "IssuedBy is required!"],
    },
  },
  {
    timestamps: true,
  }
);

export const FaqModel = model<TFaq>("faq", faqSchema);
