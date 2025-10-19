import { Schema, model } from "mongoose";
import { TShipping } from "../transactions/transactions.interface";
import {
  TCustomerInfo,
  TOrder,
  TOrderInfo,
  TPaymentInfo,
  TTotalAmount,
} from "./order.interface";

// Commission Schema
const commissionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Commission type is required!"],
    },
    value: {
      type: Number,
      required: [true, "Commission value is required!"],
    },
    amount: {
      type: Number,
      required: [true, "Commission amount is required!"],
    },
  },
  { _id: false }
);

// Shipping Schema
const shippingSchema = new Schema<TShipping>(
  {
    name: {
      type: String,
      required: [true, "Shipping name is required!"],
    },
    type: {
      type: String,
      enum: ["free", "percentage", "amount"],
      required: [true, "Shipping type is required!"],
    },
  },
  { _id: false }
);

// Total Amount Schema
const totalAmountSchema = new Schema<TTotalAmount>(
  {
    subTotal: {
      type: Number,
      required: [true, "SubTotal is required!"],
    },
    tax: {
      type: Number,
      // required: [true, "Tax is required!"],
    },
    shipping: {
      type: shippingSchema,
      // required: [true, "Shipping info is required!"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required!"],
    },
    total: {
      type: Number,
      required: [true, "Total is required!"],
    },
  },
  { _id: false }
);

// Customer Info Schema
const customerInfoSchema = new Schema<TCustomerInfo>(
  {
    firstName: { type: String, required: [true, "First name is required!"] },
    lastName: { type: String, required: [true, "Last name is required!"] },
    email: { type: String },
    phone: { type: String, required: [true, "Phone number is required!"] },
    address: { type: String, required: [true, "Address is required!"] },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

// Payment Info Schema
const paymentInfoSchema = new Schema<TPaymentInfo>(
  {
    cardNumber: {
      type: String,
      // required: [true, "Card number is required!"]
    },
    expireDate: {
      type: String,
      // required: [true, "Expire date is required!"]
    },
    cvc: {
      type: String,
      // required: [true, "CVC is required!"]
    },
    nameOnCard: {
      type: String,

      // required: [true, "Name on card is required!"]
    },
  },
  { _id: false }
);

// Order Info Schema
// const orderInfoSchema = new Schema<TOrderInfo>(
//   {
//     orderBy: {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     userRole: {
//       type: String,
//       enum: [
//         "customer",
//         "vendor",
//         "sr",
//         "seller",
//         "vendor-staff",
//         "admin",
//         "admin-staff",
//       ], // ✅ valid values
//       default: "customer", // ✅ always Guest unless provided
//     },
//     // shopInfo: {
//     //   type: Schema.Types.ObjectId,
//     //   ref: "shop",
//     //   required: true,
//     // },
//     productInfo: {
//       type: Schema.Types.ObjectId,
//       ref: "product",
//       required: true,
//     },
//     trackingNumber: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "processing",
//         "at-local-facility",
//         "delivered",
//         "cancelled",
//         "paid",
//       ],
//       required: true,
//       default: "pending",
//     },
//     isCancelled: {
//       type: Boolean,
//       default: false,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     totalAmount: {
//       type: totalAmountSchema,
//       required: true,
//     },
//     commission: {
//       type: commissionSchema,
//       required: true,
//     },
//   },
//   { _id: false }
// );

// Order Info Schema (supports multiple products)

// Ordered Product Schema used inside orderInfoSchema
const orderedProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "shop",
    },
    name: {
      type: String,
    },
    variant: {
      type: String,
    },
    sku: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    retailPrice: {
      type: Number,
    },
    wholeSalePrice: {
      type: Number,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderInfoSchema = new Schema<TOrderInfo>(
  {
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userRole: {
      type: String,
      enum: [
        "customer",
        "vendor",
        "sr",
        "seller",
        "vendor-staff",
        "admin",
        "admin-staff",
      ],
      default: "customer",
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "at-local-facility",
        "delivered",
        "cancelled",
        "paid",
      ],
      default: "pending",
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },

    productInfo: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    selectedPrice: {
      type: Number,
      default: 0,
    },

    // ✅ Multiple products support
    products: {
      type: [orderedProductSchema],
      required: [true, "Products are required in an order!"],
      default: [], // ✅ Ensure it defaults to empty array
    },
    totalQuantity: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: totalAmountSchema,
      required: true,
    },
    commission: {
      type: commissionSchema,
      required: true,
    },
  },
  { _id: false }
);

// Main Order Schema
const orderSchema = new Schema<TOrder>(
  {
    orderInfo: {
      type: [orderInfoSchema],
      required: true,
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },
    paymentInfo: {
      type: Schema.Types.Mixed,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderNote: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = model<TOrder>("order", orderSchema);
