"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopZodSchema = exports.shopDeleteZodSchema = exports.shopStatusUpdateZodSchema = exports.createShopZodSchema = exports.shopMaintenanceSettingZodSchema = exports.shopSettingZodSchema = exports.emailNotificationZodSchema = exports.shopAddressZodSchema = exports.paymentInfoZodSchema = exports.basicInfoZodSchema = void 0;
const zod_1 = require("zod");
// 🔹 Sub Schemas
exports.basicInfoZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Shop name is required!" : "Not a string!",
    }),
    slug: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Shop slug is required!" : "Not a string!",
    }),
    description: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Description is required!" : "Not a string!",
    }),
});
exports.paymentInfoZodSchema = zod_1.z.object({
    accountHolderName: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Account holder name is required!"
            : "Not a string!",
    }),
    accountHolderEmail: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Account holder email is required!"
            : "Not a string!",
    })
        .email("Invalid email format!"),
    bankName: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Bank name is required!" : "Not a string!",
    }),
    accountNumber: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Account number is required!"
            : "Not a string!",
    }),
});
exports.shopAddressZodSchema = zod_1.z.object({
    country: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Country is required!" : "Not a string!",
    }),
    city: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "City is required!" : "Not a string!",
    }),
    state: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "State is required!" : "Not a string!",
    }),
    zip: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "ZIP code is required!" : "Not a string!",
    }),
    streetAddress: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Street address is required!"
            : "Not a string!",
    }),
});
exports.emailNotificationZodSchema = zod_1.z.object({
    notificationEmail: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
            ? "Notification email is required!"
            : "Not a string!",
    })
        .email("Invalid email format!"),
    isEnabled: zod_1.z.boolean().optional(),
});
exports.shopSettingZodSchema = zod_1.z.object({
    contactNo: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Contact number is required!"
            : "Not a string!",
    }),
    websiteUrl: zod_1.z.string().url("Invalid website URL!").optional(),
});
exports.shopMaintenanceSettingZodSchema = zod_1.z.object({
    image: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Maintenance image is required!"
            : "Not a string!",
    }),
    title: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Maintenance title is required!"
            : "Not a string!",
    }),
    description: zod_1.z.string({
        error: (issue) => issue.input === undefined
            ? "Maintenance description is required!"
            : "Not a string!",
    }),
    startTime: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Start time is required!" : "Not a string!",
    }),
    endTime: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "End time is required!" : "Not a string!",
    }),
});
// 🔹 Main Shop Schema
exports.createShopZodSchema = zod_1.z.object({
    vendorId: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Vendor ID is required!" : "Not a string!",
    }),
    staffs: zod_1.z.array(zod_1.z.string()).optional(),
    logo: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    basicInfo: exports.basicInfoZodSchema,
    paymentInfo: exports.paymentInfoZodSchema.optional(),
    shopAddress: exports.shopAddressZodSchema,
    notificationEmail: exports.emailNotificationZodSchema,
    shopSetting: exports.shopSettingZodSchema,
    shopMaintenanceSetting: exports.shopMaintenanceSettingZodSchema.optional(),
    commissionRate: zod_1.z.number().optional(),
    currentBalance: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive", "pending"]).optional(),
    isApproved: zod_1.z.boolean().optional(),
    products: zod_1.z.array(zod_1.z.string()).optional(),
    orders: zod_1.z.array(zod_1.z.string()).optional(),
    transactions: zod_1.z.array(zod_1.z.string()).optional(),
    withdrawals: zod_1.z.array(zod_1.z.string()).optional(),
    attributes: zod_1.z.array(zod_1.z.string()).optional(),
    coupons: zod_1.z.array(zod_1.z.string()).optional(),
});
//update status
exports.shopStatusUpdateZodSchema = zod_1.z.object({
    updatedBy: zod_1.z.string(),
    status: zod_1.z.string(),
});
//delete shop
exports.shopDeleteZodSchema = zod_1.z.object({
    deletedBy: zod_1.z.string(),
});
//Update Shop Schema
exports.updateShopZodSchema = zod_1.z.object({
    vendorId: zod_1.z.string().optional(),
    staffs: zod_1.z.array(zod_1.z.string()).optional(),
    logo: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    basicInfo: exports.basicInfoZodSchema.partial().optional(),
    paymentInfo: exports.paymentInfoZodSchema.partial().optional(),
    shopAddress: exports.shopAddressZodSchema.partial().optional(),
    notificationEmail: exports.emailNotificationZodSchema.partial().optional(),
    shopSetting: exports.shopSettingZodSchema.partial().optional(),
    shopMaintenanceSetting: exports.shopMaintenanceSettingZodSchema.partial().optional(),
    commissionRate: zod_1.z.number().optional(),
    currentBalance: zod_1.z.number().optional(),
    status: zod_1.z.enum(["active", "inactive", "pending"]).optional(),
    isApproved: zod_1.z.boolean().optional(),
    products: zod_1.z.array(zod_1.z.string()).optional(),
    orders: zod_1.z.array(zod_1.z.string()).optional(),
    transactions: zod_1.z.array(zod_1.z.string()).optional(),
    withdrawals: zod_1.z.array(zod_1.z.string()).optional(),
    attributes: zod_1.z.array(zod_1.z.string()).optional(),
    coupons: zod_1.z.array(zod_1.z.string()).optional(),
});
