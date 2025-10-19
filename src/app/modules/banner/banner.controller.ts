import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bannerServices } from "./banner.service";




const createBanner = catchAsync(async (req, res) => {
  const result = await bannerServices.createBannerFromDB(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner Created successfully!',
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const result = await bannerServices.updateBannerFromDB(req.params.id,req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Banner updated successfully!',
    data: result,
  });
});
const getAllBanners = catchAsync(async (req, res) => {
  const result = await bannerServices.getAllBannersFromDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'banners retrieved successfully!',
    data: result,
  });
});


export const bannerController = { createBanner, getAllBanners, updateBanner };