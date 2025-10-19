import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productServices } from "./product.service";

const getAllProduct = catchAsync(async (req, res) => {
  const result = await productServices.getAllProductFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieve successfully!",
    data: result,
  });
});

const getProductsByCategoryandTag = catchAsync(async (req, res) => {
  const { category, tag } = req.query;

  const result = await productServices.getProductsByCategoryandTag(
    category as string,
    tag as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieve successfully!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await productServices.getSingleProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product retrieve successfully!",
    data: result,
  });
});

const getProductsByDiscount = catchAsync(async (req, res) => {
  const discount = req.query.discount ? Number(req.query.discount) : 0;
  const result = await productServices.getProductsByDiscount(discount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message:
      discount > 0
        ? `Products with discount ≥ ${discount}% retrieved successfully!`
        : "Products with any discount retrieved successfully!",
    data: result,
  });
});

// const createProduct = catchAsync(async (req, res) => {
//   const files = req.files as {
//     [fieldname: string]: Express.Multer.File[];
//   };

//   const productData = {
//     ...req.body,
//     featuredImg: files["featuredImgFile"]?.[0]?.path || "",
//     gallery: files["galleryImagesFiles"]
//       ? files["galleryImagesFiles"].map((f) => f.path)
//       : [],
//   };

//   const result = await productServices.createProductOnDB(productData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Product created successfully!",
//     data: result,
//   });
// });

const createProduct = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const productData = {
    ...req.body,
    featuredImg:
      files["featuredImgFile"]?.[0]?.path || req.body.featuredImg || "",
    gallery: files["galleryImagesFiles"]
      ? files["galleryImagesFiles"].map((f) => f.path)
      : req.body.gallery || [],
  };

  const result = await productServices.createProductOnDB(productData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const updatedData: any = {
    ...req.body,
  };

  if (files["featuredImgFile"]?.[0]?.path) {
    updatedData.featuredImg = files["featuredImgFile"][0].path;
  }

  if (files["galleryImagesFiles"]?.length) {
    updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
  }

  const result = await productServices.updateProductOnDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productServices.deleteProduct(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product deleted successfully!",
    data: null,
  });
});

const inventoryStats = catchAsync(async (req, res) => {
  const result = await productServices.inventoryStats(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Inventory Get successfully!",
    data: result,
  });
});

export const productControllers = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  getProductsByDiscount,
  updateProduct,
  getProductsByCategoryandTag,
  deleteProduct,
  inventoryStats,
};
