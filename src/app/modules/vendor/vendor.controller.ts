import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { vendorServices } from "./vendor.service";

const getAllVendor = catchAsync(async (req, res) => {
  const result = await vendorServices.getAllVendorFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendors retrieve successfully!",
    data: result,
  });
});

const getSingleVendor = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await vendorServices.getSingleVendorFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor retrieve successfully!",
    data: result,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const vendorData = req.body;
  const result = await vendorServices.createVendorOnDB(vendorData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor created successfully!",
    data: result,
  });
});

export const vendorControllers = {
  createVendor,
  getSingleVendor,
  getAllVendor,
};
