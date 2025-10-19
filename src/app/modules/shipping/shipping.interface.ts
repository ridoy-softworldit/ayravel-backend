export type TShipping = {
  name: string;
  type: "free" | "fixed" | "percentage";
  amount: number;
  global: "0" | "1";
};
