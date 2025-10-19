export type TTermsAndConditions = {
  name: string;
  description: string;
  type: "global" | "shops";
  issuedBy: number;
  isApproved: boolean;
};
