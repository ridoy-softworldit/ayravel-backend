"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdmin = void 0;
const mongoose_1 = require("mongoose");
// Main schema for SuperAdmin
const superAdminSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    dashboard: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "dashboard",
        required: true,
    },
    shops: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "shop" }],
    myShops: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "shop" }],
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "product" }],
    inventory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "product" }],
    brands: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "brand" }],
    termsAndCondition: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "terms" }],
    becomeASeller: { type: mongoose_1.Schema.Types.ObjectId, ref: "becomeASeller" },
}, { timestamps: true });
exports.SuperAdmin = (0, mongoose_1.model)("super-admin", superAdminSchema);
