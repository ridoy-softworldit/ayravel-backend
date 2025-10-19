import QueryBuilder from "../../builder/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { ProductSearchableFields } from "./product.const";
import { TProduct } from "./product.interface";
import { ProductModel } from "./product.model";

// const createProductOnDB = async (payload: TProduct) => {
//   const result = await ProductModel.create(payload);
//   return result;
// };

const createProductOnDB = async (payload: TProduct) => {
  if (payload.commission) {
    const { regularValue, retailValue } = payload.commission;
    if (regularValue < 0 || retailValue < 0) {
      throw new AppError(400, "Commission value cannot be negative");
    }
  }
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ProductModel.find()
      .populate("brandAndCategories.brand")
      .populate("brandAndCategories.categories")
      .populate("brandAndCategories.tags"),
    query
  )
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  return result;
};

const getProductsByDiscount = async (discount: number = 0) => {
  const products = await ProductModel.find({
    "productInfo.discount": { $gte: discount },
    "description.status": "publish",
  })
    .populate("brandAndCategories.brand")
    .populate("brandAndCategories.categories")
    .populate("brandAndCategories.tags");

  return products;
};

const getProductsByCategoryandTag = async (category: string, tag: string) => {
  const categories = category ? (category as string).split(",") : [];

  const tags = tag ? (tag as string).split(",") : [];

  const products = await ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "brandAndCategories.categories",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "brandAndCategories.tags",
        foreignField: "_id",
        as: "tagDetails",
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandAndCategories.brand",
        foreignField: "_id",
        as: "brandDetails",
      },
    },
    {
      $addFields: {
        brandAndCategories: {
          brand: { $arrayElemAt: ["$brandDetails", 0] },
          categories: "$categoryDetails",
          tags: "$tagDetails",
        },
      },
    },
    {
      $match: {
        "description.status": "publish",
        ...(categories.length
          ? { "brandAndCategories.categories.name": { $in: categories } }
          : {}),
        ...(tags.length
          ? { "brandAndCategories.tags.name": { $in: tags } }
          : {}),
      },
    },
    {
      $project: {
        categoryDetails: 0,
        tagDetails: 0,
        brandDetails: 0,
      },
    },
  ]);

  return products;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id)
    .populate("brandAndCategories.brand")
    .populate("brandAndCategories.categories")
    .populate("brandAndCategories.tags");
  return result;
};

const updateProductOnDB = async (
  id: string,
  updatedData: Partial<TProduct>
) => {
  const isProductExist = await ProductModel.findById(id);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }

  // Validate commission if provided
  if (updatedData.commission) {
    const { regularValue, retailValue } = updatedData.commission;
    if (regularValue && regularValue < 0)
      throw new AppError(400, "Regular commission value cannot be negative");
    if (retailValue && retailValue < 0)
      throw new AppError(400, "Retail commission value cannot be negative");
  }

  if (
    updatedData.deletedImages &&
    updatedData.deletedImages.length > 0 &&
    isProductExist.gallery &&
    isProductExist.gallery.length > 0
  ) {
    const restDBImages = isProductExist.gallery.filter(
      (imageurl) => !updatedData.deletedImages?.includes(imageurl)
    );

    const updatedGalleryImages = (updatedData.gallery || [])
      .filter((imageurl) => !updatedData.deletedImages?.includes(imageurl))
      .filter((imageurl) => !restDBImages.includes(imageurl));

    updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  // delete images from cloudinary if they are deleted
  if (updatedData.deletedImages && updatedData.deletedImages.length > 0) {
    await Promise.all(
      updatedData.deletedImages.map((imageurl) =>
        deleteImageFromCLoudinary(imageurl)
      )
    );
  }

  if (updatedData.featuredImg && isProductExist.featuredImg) {
    await deleteImageFromCLoudinary(isProductExist.featuredImg);
  }

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    if (product.featuredImg) {
      await deleteImageFromCLoudinary(product.featuredImg);
    }

    if (product.gallery && product.gallery.length > 0) {
      await Promise.all(
        product.gallery.map((imageurl) => deleteImageFromCLoudinary(imageurl))
      );
    }

    await product.deleteOne();
  } catch (error) {
    console.error(error);
  }
};

const inventoryStats = async (id: string) => {
  const totalProducts = await ProductModel.countDocuments();

  const totalStock = await ProductModel.aggregate([
    { $group: { _id: null, total: { $sum: "$productInfo.quantity" } } },
  ]);

  const lowStockItems = await ProductModel.countDocuments({
    "productInfo.quantity": { $gt: 0, $lt: 10 },
  });

  const outOfStock = await ProductModel.countDocuments({
    "productInfo.quantity": 0,
  });

  const totalValueAgg = await ProductModel.aggregate([
    {
      $group: {
        _id: null,
        totalValue: {
          $sum: {
            $multiply: ["$productInfo.salePrice", "$productInfo.quantity"],
          },
        },
      },
    },
  ]);

  return {
    totalProducts,
    totalStock: totalStock[0]?.total || 0,
    lowStockItems,
    outOfStock,
    totalValue: totalValueAgg[0]?.totalValue || 0,
  };
};
// const getProductOfSpecificShop = async (
//   id: string,
//   query: Record<string, unknown>
// ) => {
//   const productQuery = new QueryBuilder(
//     ProductModel.find({ shopId: id })
//       .populate("brandAndCategories.brand")
//       .populate("brandAndCategories.categories")
//       .populate("brandAndCategories.tags"),
//     query
//   )
//     .search(ProductSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await productQuery.modelQuery;
//   return result;
// };

export const productServices = {
  createProductOnDB,
  getSingleProductFromDB,
  getAllProductFromDB,
  getProductsByDiscount,
  updateProductOnDB,
  getProductsByCategoryandTag,
  deleteProduct,
  inventoryStats,
};
