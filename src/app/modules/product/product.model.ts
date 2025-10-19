import { model, Schema } from "mongoose";
import {
  TBrandAndCategories,
  TDescription,
  TExternal,
  TProduct,
  TProductInfo,
} from "./product.interface";

const calculateDiscount = (price: number, salePrice?: number) => {
  if (!salePrice || salePrice <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const brandAndCategorySchema = new Schema<TBrandAndCategories>(
  {
    brand: {
      type: Schema.Types.ObjectId,
      // required: [true, "Brand is Required!"],
      ref: "brand",
    },
    categories: {
      type: [Schema.Types.ObjectId],
      required: [true, "Category is Required!"],
      ref: "category",
    },
    tags: {
      type: [Schema.Types.ObjectId],
      required: [true, "Tag is Required!"],
      ref: "tag",
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const commissionSchema = new Schema(
  {
    regularType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    regularValue: {
      type: Number,
      default: 0, // default commission
    },
    retailType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    retailValue: {
      type: Number,
      default: 0,
    },
    allowManualOverride: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const descriptionSchema = new Schema<TDescription>(
  {
    name: {
      type: String,
      required: [true, "Name is Required!"],
    },
    slug: { type: String },
    unit: {
      type: String,
      required: [true, "Unit is Required!"],
    },
    description: {
      type: String,
      required: [true, "A small description is required!"],
    },
    status: {
      type: String,
      enum: ["publish", "draft"],
      required: [true, "Status is required!"],
      default: "draft",
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const externalSchema = new Schema<TExternal>(
  {
    productUrl: {
      type: String,
    },
    buttonLabel: {
      type: String,
    },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const productInfoSchema = new Schema<TProductInfo>(
  {
    price: {
      type: Number,
      required: [true, "Price is Required!"],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is Required!"],
    },
    retailPrice: {
      type: Number,
    },
    wholeSalePrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    }, // discount in percentage
    quantity: {
      type: Number,
      required: [true, "Quantity is Required!"],
    },
    sku: {
      type: String,
      required: [true, "sku is Required!"],
    },
    width: {
      type: String,
      required: [true, "Width is Required!"],
    },
    height: {
      type: String,
      required: [true, "Height is Required!"],
    },
    length: {
      type: String,
      required: [true, "Length is Required!"],
    },
    isDigital: {
      type: Boolean,
    },
    digital: {
      type: String,
    },
    isExternal: {
      type: Boolean,
    },
    external: externalSchema,
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<TProduct>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
    },
    featuredImg: {
      type: String,
      required: [true, "Feature image is Required!"],
    },
    gallery: {
      type: [String],
      required: [true, "Gallery is Required!"],
      default: [],
    },
    video: {
      type: String,
    },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: {
      type: String,
      enum: ["simple", "variable"],
      required: [true, "Product type is Required!"],
    },
    productInfo: productInfoSchema,
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    //commission field
    commission: commissionSchema,
  },

  {
    timestamps: true,
  }
);

// 🔹 Pre-save middleware (for create)
productSchema.pre("save", function (next) {
  const product = this as any;

  if (product.productInfo?.price && product.productInfo?.salePrice) {
    product.productInfo.discount = calculateDiscount(
      product.productInfo.price,
      product.productInfo.salePrice
    );
  } else {
    product.productInfo.discount = 0;
  }

  next();
});

// 🔹 Pre-findOneAndUpdate middleware (for update)
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;

  if (update?.productInfo?.price !== undefined) {
    const price = update.productInfo.price;
    const salePrice = update.productInfo.salePrice ?? 0;
    update.productInfo.discount = calculateDiscount(price, salePrice);
  }

  this.setUpdate(update);
  next();
});

export const ProductModel = model<TProduct>("product", productSchema);
