import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statsServices } from "./stats.service";






const getAdminStats = catchAsync(async (req, res) => {
  const payload = {
    days: 10
  }
  const result = await statsServices.getAdminStatsFromDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin stats received successfully!',
    data: result,
  });
});


const getVendorStats = catchAsync(async (req, res) => {

  const payload = {
    days: 3
  };
  const result = await statsServices.getVendorStatsFromDB(payload,req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin stats received successfully!',
    data: result,
  });
});












export const statsController = { getAdminStats, getVendorStats };