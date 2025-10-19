import { Types } from "mongoose";

export type TShipping = {
  name: string;
  type: "free" | "percentage" | "amount";
};

export type TCommission = {
  isAddedToBalance: boolean;
  type: "percentage" | "fixed";
  value: number; // e.g. 10 means 10% or 10 taka
  amount: number; // calculated commission amount
};

export type TTotalAmount = {
  subTotal: number;
  tax?: number;
  shipping?: TShipping;
  discount: number;
  total: number;
};

export type TCustomerInfo = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type TPaymentInfo = {
  cardNumber?: string;
  expireDate?: string;
  cvc?: string;
  nameOnCard?: string;
};

export type TOrderedProduct = {
  product: Types.ObjectId; // ref: "product"
  shop?: Types.ObjectId; // ref: "shop"
  name?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  retailPrice?: number;
  wholeSalePrice?: number;
  quantity: number;
  variant?: string;
  subtotal: number; // price * quantity
};

export type TOrderInfo = {
  user: number;
  orderBy?: Types.ObjectId;
  userRole?: string;
  shopInfo?: Types.ObjectId;
  productInfo: Types.ObjectId;
  trackingNumber?: String;
  status:
    | "pending"
    | "processing"
    | "at-local-facility"
    | "delivered"
    | "cancelled"
    | "paid";
  isCancelled: boolean;
  quantity: number;
  selectedPrice: number;
  totalQuantity: number;
  // ✅ multiple products in one order info
  products: TOrderedProduct[];
  totalAmount: TTotalAmount;
  commission: TCommission;
};

export type TOrder = {
  totalQuantity: number;
  orderInfo: TOrderInfo[];
  customerInfo: TCustomerInfo;
  paymentInfo: TPaymentInfo | "cash-on";
  totalAmount: number;
  orderNote?: string;
};
