"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = require("mongoose");
// Address Schema
const addressSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['billing', 'shipping'],
        required: [true, 'Address type is required!'],
    },
    title: {
        type: String,
        required: [true, 'Title is required!'],
    },
    country: {
        type: String,
        required: [true, 'Country is required!'],
    },
    city: {
        type: String,
        required: [true, 'City is required!'],
    },
    state: {
        type: String,
        required: [true, 'State is required!'],
    },
    'zip-code': {
        type: String,
        required: [true, 'Zip code is required!'],
    },
    street: {
        type: String,
        required: [true, 'Street is required!'],
    },
}, { _id: false });
// Cart Item Product Schema
const cartItemProductSchema = new mongoose_1.Schema({
    productId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'product',
            required: [true, 'Product ID is required!'],
        },
    ],
    quantity: {
        type: Number,
        required: [true, 'Quantity is required!'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required!'],
    },
}, { _id: false });
// Cart Item Schema
const cartItemSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required!'],
    },
    productInfo: [
        {
            type: cartItemProductSchema,
            required: [true, 'Product info is required!'],
        },
    ],
}, { _id: false });
// Orders Schema
const ordersSchema = new mongoose_1.Schema({
    orderInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'order',
        required: [true, 'Order info is required!'],
    },
    totalAmount: {
        subtotal: { type: Number, required: [true, 'Subtotal is required!'] },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        shipping: { type: Number, default: 0 },
        grandTotal: {
            type: Number,
            required: [true, 'Grand total is required!'],
        },
    },
}, { _id: false });
// Customer Schema
const customerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required!'],
    },
    address: {
        type: [addressSchema],
        default: [],
    },
    cardInfo: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    cartItem: {
        type: [cartItemSchema],
        default: [],
    },
    wishlist: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'product',
        required: [true, 'Product ID is required!'],
    },
    orders: {
        type: [ordersSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.CustomerModel = (0, mongoose_1.model)('customer', customerSchema);
