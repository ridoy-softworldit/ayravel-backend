import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieve successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.getSingleCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieve successfully!",
    data: result,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const body = req.body;
  const categoryData = {
    ...body,
    image: files["image"]?.[0]?.path || body.image || "",
    bannerImg: files["bannerImg"]?.[0]?.path || body.bannerImg || "",
    icon: {
      name: body.icon.name || body["icon.name"], // ✅ support both cases
      url: files["icon"]?.[0]?.path || body.iconUrl || "", // ✅ icon image path
    },
  };

  console.log(categoryData);

  const result = await categoryServices.createCategoryIntoDB(categoryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully!",
    data: result,
  });
});

const editCategory = catchAsync(async (req, res) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const body = req.body;
  const updateCategoryData = {
    ...body,
  };

  if (files["image"]?.[0]?.path) {
    updateCategoryData.image = files["image"]?.[0]?.path;
  }

  if (files["bannerImg"]?.[0]?.path) {
    updateCategoryData.bannerImg = files["bannerImg"]?.[0]?.path;
  }

  if (files["icon"]?.[0]?.path || body.iconName || body.iconUrl) {
    updateCategoryData.icon = {
      name: body.icon.name || body["icon.name"],
      url: files["icon"]?.[0]?.path || body.iconUrl || "",
    };
  }
  const result = await categoryServices.editCategory(
    req.params.id,
    updateCategoryData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await categoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryControllers = {
  getAllCategory,
  getSingleCategory,
  createCategory,
  deleteCategory,
  editCategory,
};
