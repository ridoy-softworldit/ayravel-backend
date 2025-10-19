export type TCoupon = {
  image: string;
  code: string;
  description: string;
  type: "fixed" | "percentage" | "fixed";
  discountAmount: number;
  isVerifiedCustomer?: boolean;
  isApproved?: boolean;
  activeDate: Date;
  expireDate: Date;
};
