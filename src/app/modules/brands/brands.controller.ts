import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { brandServices } from "./brands.service";

const getAllBrands = catchAsync(async (req, res) => {
  const result = await brandServices.getAllBrandsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brands retrieve successfully!",
    data: result,
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await brandServices.getSingleBrandFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand data retrieve successfully!",
    data: result,
  });
});

const createBrand = catchAsync(async (req, res) => {
  const brandData = req.body;
  const result = await brandServices.createBrandOnDB(brandData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand created successfully!",
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const brandData = req.body;
  const result = await brandServices.updateSingleBrandOnDB(
    req.params.id,
    brandData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand updated successfully!",
    data: result,
  });
});

export const brandsControllers = {
  getAllBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
};
