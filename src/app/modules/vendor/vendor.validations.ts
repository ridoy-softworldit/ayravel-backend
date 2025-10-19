import { z } from "zod";

// Summery validation
const summeryZodSchema = z.object({
  totalRevenue: z.number().default(0),
  todaysRevenue: z.number().default(0),
  todaysRefund: z.number().default(0),
  totalShop: z.number().default(0),
});

// Order Status validation
const orderStatusZodSchema = z.object({
  pending: z.number().default(0),
  processing: z.number().default(0),
  completed: z.number().default(0),
  cancelled: z.number().default(0),
});

// Sales History validation
const salesHistoryZodSchema = z.object({
  totalSales: z.number().default(0),
  months: z
    .enum([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ])
    .default("January"),
});

// Top Category validation
const topCategoryZodSchema = z.object({
  categoryId: z.string().nullable().default(null),
  categoryName: z.string().default(""),
  shop: z.string().default(""),
  totalProducts: z.number().default(0),
});

// Main Vendor Validation
export const createVendorZodSchema = z.object({
  userId: z.string({
    error: () => "UserId is required!",
  }),
  shops: z.string().nullable().optional().default(null),
  shopTransfer: z.array(z.string()).default([]),
  messages: z.array(z.string()).default([]),
  storeNotices: z.array(z.string()).default([]),
  summery: summeryZodSchema.optional(),
  orderStatus: orderStatusZodSchema.optional(),
  salesHistory: z.array(salesHistoryZodSchema).default([]),
  topCategoryByProducts: z.array(topCategoryZodSchema).default([]),
  status: z.enum(["pending", "approved"]).default("pending"),
});
