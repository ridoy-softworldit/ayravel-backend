import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidation = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const dashboardValidation = z.object({
  summary: objectIdValidation,
  orderStatus: objectIdValidation,
  recentOrders: z.array(objectIdValidation).optional(),
  salesHistory: z.array(objectIdValidation).optional(),
  popularProducts: z.array(objectIdValidation).optional(),
  lowStockProducts: z.array(objectIdValidation).optional(),
  topCategoryWithProducts: z.array(objectIdValidation).optional(),
  withdrawals: z.array(objectIdValidation).optional(),
  attributes: z.array(objectIdValidation).optional(),
  taxes: z.array(objectIdValidation).optional(),
  shippings: z.array(objectIdValidation).optional(),
  orders: z.array(objectIdValidation).optional(),
  transactions: z.array(objectIdValidation).optional(),
  faqs: z.array(objectIdValidation).optional(),
  users: z.array(objectIdValidation).optional(),
  vendors: z.array(objectIdValidation).optional(),
  customers: z.array(objectIdValidation).optional(),
  coupons: z.array(objectIdValidation).optional(),
});
