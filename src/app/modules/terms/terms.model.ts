import { model, Schema } from "mongoose";
import { TTermsAndConditions } from "./terms.interface";

// Sub-schema for Terms & Conditions
const termsAndConditionsSchema = new Schema<TTermsAndConditions>(
  {
    name: { type: String, required: [true, "Name is required!"] },
    description: { type: String, required: [true, "Description is required!"] },
    type: {
      type: String,
      enum: ["global", "shops"],
      required: [true, "Type is required!"],
    },
    issuedBy: { type: Number, required: [true, "IssuedBy is required!"] },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const TermsModel = model<TTermsAndConditions>(
  "terms",
  termsAndConditionsSchema
);
