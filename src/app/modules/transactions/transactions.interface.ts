export type TShipping = {
  name: string;
  type: "free" | "percentage" | "fixed";
  amount: number;
};

export type TPaymentInfo = {
  paymentGateway: "cash-on";
  status: boolean;
};

export type TTransaction = {
  trackingNumber?: string;
  total: number;
  productPrice: number;
  shipping: TShipping;
  tax: number;
  discount?: number;
  paymentInfo: TPaymentInfo;
};
