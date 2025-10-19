"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductZodSchema = exports.createProductZodSchema = void 0;
const zod_1 = require("zod");
// brandAndCategories validation
const brandAndCategoryZodSchema = zod_1.z.object({
    // brand: z.string({
    //   error: () => "Brand ID is required!",
    // }),
    brand: zod_1.z.string().optional(),
    categories: zod_1.z
        .array(zod_1.z.string({ error: () => "Category ID must be a string!" }))
        .min(1, { message: "At least one category is required!" }),
    tags: zod_1.z
        .array(zod_1.z.string({ error: () => "Tag ID must be a string!" }))
        .min(1, { message: "At least one tag is required!" }),
});
const updatebrandAndCategoryZodSchema = zod_1.z.object({
    brand: zod_1.z.string(),
    categories: zod_1.z.array(zod_1.z.string({ error: () => "Category ID must be a string!" })),
    tags: zod_1.z.array(zod_1.z.string({ error: () => "Tag ID must be a string!" })),
});
// description validation
const descriptionZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: () => "Name is required!",
    }),
    slug: zod_1.z.string().optional(),
    unit: zod_1.z.string({
        error: () => "Unit is required!",
    }),
    description: zod_1.z.string({
        error: () => "A small description is required!",
    }),
    status: zod_1.z.enum(["publish", "draft"], { message: "Custom error message" }),
});
// external product validation
const externalZodSchema = zod_1.z.object({
    productUrl: zod_1.z.string().optional(),
    buttonLabel: zod_1.z.string().optional(),
});
// commission schema validation
const commissionZodSchema = zod_1.z.object({
    regularType: zod_1.z
        .enum(["percentage", "fixed"], {
        message: "Regular type must be either 'percentage' or 'fixed'",
    })
        .default("percentage"),
    regularValue: zod_1.z
        .number({ error: () => ({ message: "Regular value must be a number" }) })
        .nonnegative("Regular commission value cannot be negative")
        .default(0),
    retailType: zod_1.z
        .enum(["percentage", "fixed"], {
        message: "Retail type must be either 'percentage' or 'fixed'",
    })
        .default("percentage"),
    retailValue: zod_1.z
        .number({ error: () => ({ message: "Retail value must be a number" }) })
        .nonnegative("Retail commission value cannot be negative")
        .default(0),
    allowManualOverride: zod_1.z.boolean().optional().default(false),
});
// productInfo validation
const productInfoZodSchema = zod_1.z.object({
    price: zod_1.z.number({
        error: () => "Price is required!",
    }),
    salePrice: zod_1.z.number({
        error: () => "Sale price is required!",
    }),
    retailPrice: zod_1.z.number().optional(),
    wholeSalePrice: zod_1.z.number().optional(),
    discount: zod_1.z.number().optional(),
    quantity: zod_1.z.number({
        error: () => "Quantity is required!",
    }),
    sku: zod_1.z.string({
        error: () => "SKU is required!",
    }),
    width: zod_1.z.string({
        error: () => "Width is required!",
    }),
    height: zod_1.z.string({
        error: () => "Height is required!",
    }),
    length: zod_1.z.string({
        error: () => "Length is required!",
    }),
    isDigital: zod_1.z.boolean().optional(),
    digital: zod_1.z.string().optional(),
    isExternal: zod_1.z.boolean().optional(),
    external: externalZodSchema.optional(),
});
// Main Product Validation
exports.createProductZodSchema = zod_1.z.object({
    shopId: zod_1.z.string().optional(),
    video: zod_1.z.string().optional(),
    brandAndCategories: brandAndCategoryZodSchema,
    description: descriptionZodSchema,
    productType: zod_1.z.enum(["simple", "variable"], {
        message: "Product type must be 'simple' or 'variable'",
    }),
    productInfo: productInfoZodSchema,
    specifications: zod_1.z.any().optional(),
    // commission validation
    commission: commissionZodSchema.optional(),
});
exports.updateProductZodSchema = zod_1.z.object({
    shopId: zod_1.z.string().optional(),
    featuredImg: zod_1.z.string().url("Invalid feature image URL!").optional(),
    gallery: zod_1.z.array(zod_1.z.string().url("Invalid gallery image URL!")).optional(),
    video: zod_1.z.string().optional(),
    brandAndCategories: zod_1.z.any(),
    description: zod_1.z.any(),
    productType: zod_1.z
        .enum(["simple", "variable"], {
        message: "Product type must be 'simple' or 'variable'",
    })
        .optional(),
    productInfo: zod_1.z.any(),
    specifications: zod_1.z.any().optional(),
    deletedImages: zod_1.z.array(zod_1.z.string()).optional(),
});
