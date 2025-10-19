import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { shippingServices } from "./shipping.service";

const getAllShipping = catchAsync(async (req, res) => {
  const result = await shippingServices.getAllShippingFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipping methods retrieved successfully!",
    data: result,
  });
});

const getSingleShipping = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await shippingServices.getSingleShippingFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipping method retrieved successfully!",
    data: result,
  });
});

const createShipping = catchAsync(async (req, res) => {
  const shippingData = req.body;
  const result = await shippingServices.createShippingOnDB(shippingData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipping method created successfully!",
    data: result,
  });
});

export const shippingControllers = {
  createShipping,
  getSingleShipping,
  getAllShipping,
};
