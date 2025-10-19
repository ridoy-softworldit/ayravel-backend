import { z } from "zod";

// brandAndCategories validation
const brandAndCategoryZodSchema = z.object({
  // brand: z.string({
  //   error: () => "Brand ID is required!",
  // }),
  brand: z.string().optional(),
  categories: z
    .array(z.string({ error: () => "Category ID must be a string!" }))
    .min(1, { message: "At least one category is required!" }),
  tags: z
    .array(z.string({ error: () => "Tag ID must be a string!" }))
    .min(1, { message: "At least one tag is required!" }),
});

const updatebrandAndCategoryZodSchema = z.object({
  brand: z.string(),
  categories: z.array(
    z.string({ error: () => "Category ID must be a string!" })
  ),
  tags: z.array(z.string({ error: () => "Tag ID must be a string!" })),
});
// description validation
const descriptionZodSchema = z.object({
  name: z.string({
    error: () => "Name is required!",
  }),
  slug: z.string().optional(),
  unit: z.string({
    error: () => "Unit is required!",
  }),
  description: z.string({
    error: () => "A small description is required!",
  }),
  status: z.enum(["publish", "draft"], { message: "Custom error message" }),
});

// external product validation
const externalZodSchema = z.object({
  productUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
});

// commission schema validation
const commissionZodSchema = z.object({
  regularType: z
    .enum(["percentage", "fixed"] as const, {
      message: "Regular type must be either 'percentage' or 'fixed'",
    })
    .default("percentage"),

  regularValue: z
    .number({ error: () => ({ message: "Regular value must be a number" }) })
    .nonnegative("Regular commission value cannot be negative")
    .default(0),

  retailType: z
    .enum(["percentage", "fixed"] as const, {
      message: "Retail type must be either 'percentage' or 'fixed'",
    })
    .default("percentage"),

  retailValue: z
    .number({ error: () => ({ message: "Retail value must be a number" }) })
    .nonnegative("Retail commission value cannot be negative")
    .default(0),

  allowManualOverride: z.boolean().optional().default(false),
});

// productInfo validation
const productInfoZodSchema = z.object({
  price: z.number({
    error: () => "Price is required!",
  }),
  salePrice: z.number({
    error: () => "Sale price is required!",
  }),
  retailPrice: z.number().optional(),
  wholeSalePrice: z.number().optional(),
  discount: z.number().optional(),
  quantity: z.number({
    error: () => "Quantity is required!",
  }),
  sku: z.string({
    error: () => "SKU is required!",
  }),
  width: z.string({
    error: () => "Width is required!",
  }),
  height: z.string({
    error: () => "Height is required!",
  }),
  length: z.string({
    error: () => "Length is required!",
  }),
  isDigital: z.boolean().optional(),
  digital: z.string().optional(),
  isExternal: z.boolean().optional(),
  external: externalZodSchema.optional(),
});

// Main Product Validation
export const createProductZodSchema = z.object({
  shopId: z.string().optional(),
  video: z.string().optional(),
  brandAndCategories: brandAndCategoryZodSchema,
  description: descriptionZodSchema,
  productType: z.enum(["simple", "variable"], {
    message: "Product type must be 'simple' or 'variable'",
  }),
  productInfo: productInfoZodSchema,
  specifications: z.any().optional(),
  // commission validation
  commission: commissionZodSchema.optional(),
});

export const updateProductZodSchema = z.object({
  shopId: z.string().optional(),
  featuredImg: z.string().url("Invalid feature image URL!").optional(),
  gallery: z.array(z.string().url("Invalid gallery image URL!")).optional(),
  video: z.string().optional(),
  brandAndCategories: z.any(),
  description: z.any(),
  productType: z
    .enum(["simple", "variable"], {
      message: "Product type must be 'simple' or 'variable'",
    })
    .optional(),
  productInfo: z.any(),
  specifications: z.any().optional(),
  deletedImages: z.array(z.string()).optional(),
});
