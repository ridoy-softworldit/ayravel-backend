import { Schema, model, Types } from "mongoose";
import { TSuperAdmin } from "./superAdmin.interface";

// Main schema for SuperAdmin
const superAdminSchema = new Schema<TSuperAdmin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    dashboard: {
      type: Schema.Types.ObjectId,
      ref: "dashboard",
      required: true,
    },
    shops: [{ type: Schema.Types.ObjectId, ref: "shop" }],
    myShops: [{ type: Schema.Types.ObjectId, ref: "shop" }],
    products: [{ type: Schema.Types.ObjectId, ref: "product" }],
    inventory: [{ type: Schema.Types.ObjectId, ref: "product" }],
    brands: [{ type: Schema.Types.ObjectId, ref: "brand" }],
    termsAndCondition: [{ type: Schema.Types.ObjectId, ref: "terms" }],
    becomeASeller: { type: Schema.Types.ObjectId, ref: "becomeASeller" },
  },
  { timestamps: true }
);

export const SuperAdmin = model<TSuperAdmin>("super-admin", superAdminSchema);
