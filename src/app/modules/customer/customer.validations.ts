import { z } from "zod";

// Address Validation
const addressZodSchema = z.object({
  type: z.enum(["billing", "shipping"], {
    message: "Address type must be 'billing' or 'shipping'",
  }),
  title: z.string({
    error: () => "Title is required!",
  }),
  country: z.string({
    error: () => "Country is required!",
  }),
  city: z.string({
    error: () => "City is required!",
  }),
  state: z.string({
    error: () => "State is required!",
  }),
  "zip-code": z.string({
    error: () => "Zip code is required!",
  }),
  street: z.string({
    error: () => "Street is required!",
  }),
});

// Cart Item Product Validation
const cartItemProductZodSchema = z.object({
  productId: z
    .array(
      z.string({
        error: () => "Product ID must be a string!",
      })
    )
    .min(1, { message: "At least one product is required!" }),
  quantity: z.number({
    error: () => "Quantity is required!",
  }),
  totalAmount: z.number({
    error: () => "Total amount is required!",
  }),
});

// Cart Item Validation
const cartItemZodSchema = z.object({
  userId: z.string({
    error: () => "User ID is required!",
  }),
  productInfo: z
    .array(cartItemProductZodSchema)
    .min(1, { message: "At least one product info is required!" }),
});

// Wishlist Validation
const wishlistZodSchema = z.object({
  userId: z.string({
    error: () => "User ID is required!",
  }),
  products: z.string({
    error: () => "Product ID is required!",
  }),
});

// Orders Validation
const ordersZodSchema = z.object({
  orderInfo: z.string({
    error: () => "Order info is required!",
  }),
  totalAmount: z.object({
    subtotal: z.number({
      error: () => "Subtotal is required!",
    }),
    discount: z.number().default(0),
    tax: z.number().default(0),
    shipping: z.number().default(0),
    grandTotal: z.number({
      error: () => "Grand total is required!",
    }),
  }),
});

// Main Customer Validation
export const createCustomerZodSchema = z.object({
  userId: z.string({
    error: () => "User ID is required!",
  }),
  address: z.array(addressZodSchema).optional(),
  cardInfo: z.any().nullable(),
  cartItem: z.array(cartItemZodSchema).optional(),
  wishlist: z.array(wishlistZodSchema).optional(),
  orders: z.array(ordersZodSchema).optional(),
});

// Update Schemas (all optional)
const updateAddressZodSchema = z
  .object({
    type: z
      .enum(["billing", "shipping"], {
        message: "Address type must be 'billing' or 'shipping'",
      })
      .optional(),
    title: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    "zip-code": z.string().optional(),
    street: z.string().optional(),
  })
  .partial();

const updateCartItemProductZodSchema = z
  .object({
    productId: z.array(z.string().optional()).min(0).optional(),
    quantity: z.number().optional(),
    totalAmount: z.number().optional(),
  })
  .partial();

const updateCartItemZodSchema = z
  .object({
    userId: z.string().optional(),
    productInfo: z.array(updateCartItemProductZodSchema).optional(),
  })
  .partial();



const updateOrdersZodSchema = z
  .object({
    orderInfo: z.string().optional(),
    totalAmount: z
      .object({
        subtotal: z.number().optional(),
        discount: z.number().default(0).optional(),
        tax: z.number().default(0).optional(),
        shipping: z.number().default(0).optional(),
        grandTotal: z.number().optional(),
      })
      .optional(),
  })
  .partial();

// Update Customer Validation
export const updateCustomerZodSchema = z.object({
  userId: z.string().optional(),
  address: z.array(updateAddressZodSchema).optional(),
  cardInfo: z.any().nullable().optional(),
  cartItem: z.array(updateCartItemZodSchema).optional(),
  wishlist: z.array(z.string()).optional(),
  orders: z.array(updateOrdersZodSchema).optional(),
});
