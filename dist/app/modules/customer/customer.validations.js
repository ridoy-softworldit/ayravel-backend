"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerZodSchema = exports.createCustomerZodSchema = void 0;
const zod_1 = require("zod");
// Address Validation
const addressZodSchema = zod_1.z.object({
    type: zod_1.z.enum(["billing", "shipping"], {
        message: "Address type must be 'billing' or 'shipping'",
    }),
    title: zod_1.z.string({
        error: () => "Title is required!",
    }),
    country: zod_1.z.string({
        error: () => "Country is required!",
    }),
    city: zod_1.z.string({
        error: () => "City is required!",
    }),
    state: zod_1.z.string({
        error: () => "State is required!",
    }),
    "zip-code": zod_1.z.string({
        error: () => "Zip code is required!",
    }),
    street: zod_1.z.string({
        error: () => "Street is required!",
    }),
});
// Cart Item Product Validation
const cartItemProductZodSchema = zod_1.z.object({
    productId: zod_1.z
        .array(zod_1.z.string({
        error: () => "Product ID must be a string!",
    }))
        .min(1, { message: "At least one product is required!" }),
    quantity: zod_1.z.number({
        error: () => "Quantity is required!",
    }),
    totalAmount: zod_1.z.number({
        error: () => "Total amount is required!",
    }),
});
// Cart Item Validation
const cartItemZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "User ID is required!",
    }),
    productInfo: zod_1.z
        .array(cartItemProductZodSchema)
        .min(1, { message: "At least one product info is required!" }),
});
// Wishlist Validation
const wishlistZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "User ID is required!",
    }),
    products: zod_1.z.string({
        error: () => "Product ID is required!",
    }),
});
// Orders Validation
const ordersZodSchema = zod_1.z.object({
    orderInfo: zod_1.z.string({
        error: () => "Order info is required!",
    }),
    totalAmount: zod_1.z.object({
        subtotal: zod_1.z.number({
            error: () => "Subtotal is required!",
        }),
        discount: zod_1.z.number().default(0),
        tax: zod_1.z.number().default(0),
        shipping: zod_1.z.number().default(0),
        grandTotal: zod_1.z.number({
            error: () => "Grand total is required!",
        }),
    }),
});
// Main Customer Validation
exports.createCustomerZodSchema = zod_1.z.object({
    userId: zod_1.z.string({
        error: () => "User ID is required!",
    }),
    address: zod_1.z.array(addressZodSchema).optional(),
    cardInfo: zod_1.z.any().nullable(),
    cartItem: zod_1.z.array(cartItemZodSchema).optional(),
    wishlist: zod_1.z.array(wishlistZodSchema).optional(),
    orders: zod_1.z.array(ordersZodSchema).optional(),
});
// Update Schemas (all optional)
const updateAddressZodSchema = zod_1.z
    .object({
    type: zod_1.z
        .enum(["billing", "shipping"], {
        message: "Address type must be 'billing' or 'shipping'",
    })
        .optional(),
    title: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    "zip-code": zod_1.z.string().optional(),
    street: zod_1.z.string().optional(),
})
    .partial();
const updateCartItemProductZodSchema = zod_1.z
    .object({
    productId: zod_1.z.array(zod_1.z.string().optional()).min(0).optional(),
    quantity: zod_1.z.number().optional(),
    totalAmount: zod_1.z.number().optional(),
})
    .partial();
const updateCartItemZodSchema = zod_1.z
    .object({
    userId: zod_1.z.string().optional(),
    productInfo: zod_1.z.array(updateCartItemProductZodSchema).optional(),
})
    .partial();
const updateOrdersZodSchema = zod_1.z
    .object({
    orderInfo: zod_1.z.string().optional(),
    totalAmount: zod_1.z
        .object({
        subtotal: zod_1.z.number().optional(),
        discount: zod_1.z.number().default(0).optional(),
        tax: zod_1.z.number().default(0).optional(),
        shipping: zod_1.z.number().default(0).optional(),
        grandTotal: zod_1.z.number().optional(),
    })
        .optional(),
})
    .partial();
// Update Customer Validation
exports.updateCustomerZodSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    address: zod_1.z.array(updateAddressZodSchema).optional(),
    cardInfo: zod_1.z.any().nullable().optional(),
    cartItem: zod_1.z.array(updateCartItemZodSchema).optional(),
    wishlist: zod_1.z.array(zod_1.z.string()).optional(),
    orders: zod_1.z.array(updateOrdersZodSchema).optional(),
});
