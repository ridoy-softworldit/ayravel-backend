import { model, Schema } from "mongoose";
import {
  TPaymentInfo,
  TShipping,
  TTransaction,
} from "./transactions.interface";

const shippingSchema = new Schema<TShipping>(
  {
    name: {
      type: String,
      required: [true, "Shipping Name is Required!"],
    },
    type: {
      type: String,
      enum: ["free", "percentage", "fixed"],
      required: [true, "Shipping type is Required!"],
    },
    amount: {
      type: Number,
      required: [true, "Shipping amount is Required!"],
    },
  },
  { _id: false }
);

const paymentInfoSchema = new Schema<TPaymentInfo>(
  {
    paymentGateway: {
      type: String,
      enum: ["cash-on"],
      required: [true, "Payment gateway is Required!"],
    },
    status: {
      type: Boolean,
      required: [true, "Payment status is Required!"],
    },
  },
  { _id: false }
);

const transactionSchema = new Schema<TTransaction>(
  {
    trackingNumber: {
      type: String,
    },
    total: {
      type: Number,
      required: [true, "Total is Required!"],
    },
    productPrice: {
      type: Number,
      required: [true, "Product price is Required!"],
    },
    shipping: shippingSchema,
    tax: {
      type: Number,
      required: [true, "Tax is Required!"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    paymentInfo: paymentInfoSchema,
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = model<TTransaction>(
  "transaction",
  transactionSchema
);
