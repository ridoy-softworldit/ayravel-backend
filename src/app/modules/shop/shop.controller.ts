import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { shopServices } from "./shop.service";

const getAllShop = catchAsync(async (req, res) => {
  const result = await shopServices.getAllShopsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shops retrieve successfully!",
    data: result,
  });
});

const getSingleShop = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await shopServices.getSingleShopFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop retrieve successfully!",
    data: result,
  });
});

const getShopStats = catchAsync(async (req, res) => {
  const result = await shopServices.getShopStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop stats retrieve successfully!",
    data: result,
  });
});

const createShop = catchAsync(async (req, res) => {
  const userId = req?.params?.id;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const payload = {
    ...req.body,
    logo: files["shopLogofile"]?.[0]?.path || "",
    coverImage: files["shopCoverFile"]?.[0]?.path || "",
  };
  const result = await shopServices.createShopIntoDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop created successfully!",
    data: result,
  });
});

const toggleShopStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await shopServices.toggleShopActiveStatusIntoDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop status updated successfully!",
    data: result,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const { id } = req.params;

  const payload = req.body;

  const result = await shopServices.deleteShopFromDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop deleted successfully!",
    data: result,
  });
});
const updateShop = catchAsync(async (req, res) => {
  const { id, userId } = req.params;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const payload = {
    ...req.body,
    logo: files?.["shopLogofile"]?.[0]?.path || undefined,
    coverImage: files?.["shopCoverFile"]?.[0]?.path || undefined,
  };

  const result = await shopServices.updateShopIntoDB(id, userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shop updated successfully!",
    data: result,
  });
});

const getMyShopData = catchAsync(async (req, res) => {
  const vendorId = req?.params?.id;

  const result = await shopServices.getMyShopDataFromDB(vendorId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My shops data retrieved successfully!",
    data: result,
  });
});

export const shopControllers = {
  getAllShop,
  getSingleShop,
  getShopStats,
  createShop,
  toggleShopStatus,
  updateShop,
  deleteShop,
  getMyShopData,
};
