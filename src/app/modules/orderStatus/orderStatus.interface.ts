export type TOrderStatus = {
  statusOf: "daily" | "weekly" | "monthly" | "yearly";
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
};
