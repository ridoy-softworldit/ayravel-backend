import { z } from "zod";

// 🔹 Sub Schemas
export const basicInfoZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Shop name is required!" : "Not a string!",
  }),
  slug: z.string({
    error: (issue) =>
      issue.input === undefined ? "Shop slug is required!" : "Not a string!",
  }),
  description: z.string({
    error: (issue) =>
      issue.input === undefined ? "Description is required!" : "Not a string!",
  }),
});

export const paymentInfoZodSchema = z.object({
  accountHolderName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Account holder name is required!"
        : "Not a string!",
  }),
  accountHolderEmail: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Account holder email is required!"
          : "Not a string!",
    })
    .email("Invalid email format!"),
  bankName: z.string({
    error: (issue) =>
      issue.input === undefined ? "Bank name is required!" : "Not a string!",
  }),
  accountNumber: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Account number is required!"
        : "Not a string!",
  }),
});

export const shopAddressZodSchema = z.object({
  country: z.string({
    error: (issue) =>
      issue.input === undefined ? "Country is required!" : "Not a string!",
  }),
  city: z.string({
    error: (issue) =>
      issue.input === undefined ? "City is required!" : "Not a string!",
  }),
  state: z.string({
    error: (issue) =>
      issue.input === undefined ? "State is required!" : "Not a string!",
  }),
  zip: z.string({
    error: (issue) =>
      issue.input === undefined ? "ZIP code is required!" : "Not a string!",
  }),
  streetAddress: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Street address is required!"
        : "Not a string!",
  }),
});

export const emailNotificationZodSchema = z.object({
  notificationEmail: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Notification email is required!"
          : "Not a string!",
    })
    .email("Invalid email format!"),
  isEnabled: z.boolean().optional(),
});

export const shopSettingZodSchema = z.object({
  contactNo: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Contact number is required!"
        : "Not a string!",
  }),
  websiteUrl: z.string().url("Invalid website URL!").optional(),
});

export const shopMaintenanceSettingZodSchema = z.object({
  image: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Maintenance image is required!"
        : "Not a string!",
  }),
  title: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Maintenance title is required!"
        : "Not a string!",
  }),
  description: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Maintenance description is required!"
        : "Not a string!",
  }),
  startTime: z.string({
    error: (issue) =>
      issue.input === undefined ? "Start time is required!" : "Not a string!",
  }),
  endTime: z.string({
    error: (issue) =>
      issue.input === undefined ? "End time is required!" : "Not a string!",
  }),
});

// 🔹 Main Shop Schema
export const createShopZodSchema = z.object({
  vendorId: z.string({
    error: (issue) =>
      issue.input === undefined ? "Vendor ID is required!" : "Not a string!",
  }),
  staffs: z.array(z.string()).optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),

  basicInfo: basicInfoZodSchema,
  paymentInfo: paymentInfoZodSchema.optional(),
  shopAddress: shopAddressZodSchema,
  notificationEmail: emailNotificationZodSchema,
  shopSetting: shopSettingZodSchema,
  shopMaintenanceSetting: shopMaintenanceSettingZodSchema.optional(),

  commissionRate: z.number().optional(),
  currentBalance: z.number().optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
  isApproved: z.boolean().optional(),

  products: z.array(z.string()).optional(),
  orders: z.array(z.string()).optional(),
  transactions: z.array(z.string()).optional(),
  withdrawals: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(),
  coupons: z.array(z.string()).optional(),
});

//update status

export const shopStatusUpdateZodSchema = z.object({
  updatedBy: z.string(),
  status: z.string(),
});

//delete shop

export const shopDeleteZodSchema = z.object({
  deletedBy: z.string(),
});

//Update Shop Schema
export const updateShopZodSchema = z.object({
  vendorId: z.string().optional(),
  staffs: z.array(z.string()).optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),

  basicInfo: basicInfoZodSchema.partial().optional(),
  paymentInfo: paymentInfoZodSchema.partial().optional(),
  shopAddress: shopAddressZodSchema.partial().optional(),
  notificationEmail: emailNotificationZodSchema.partial().optional(),
  shopSetting: shopSettingZodSchema.partial().optional(),
  shopMaintenanceSetting: shopMaintenanceSettingZodSchema.partial().optional(),

  commissionRate: z.number().optional(),
  currentBalance: z.number().optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
  isApproved: z.boolean().optional(),

  products: z.array(z.string()).optional(),
  orders: z.array(z.string()).optional(),
  transactions: z.array(z.string()).optional(),
  withdrawals: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(),
  coupons: z.array(z.string()).optional(),
});
