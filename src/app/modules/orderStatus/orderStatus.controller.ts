import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { orderStatusServices } from "./orderStatus.service";

// 🔹 Get all OrderStatus
const getAllOrderStatus = catchAsync(async (req, res) => {
  const result = await orderStatusServices.getAllOrderStatusFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order statuses retrieved successfully!",
    data: result,
  });
});

// 🔹 Get single OrderStatus
const getSingleOrderStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderStatusServices.getSingleOrderStatusFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status retrieved successfully!",
    data: result,
  });
});

// 🔹 Create OrderStatus
const createOrderStatus = catchAsync(async (req, res) => {
  const orderStatusData = req.body;
  const result = await orderStatusServices.createOrderStatusIntoDB(
    orderStatusData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status created successfully!",
    data: result,
  });
});

// 🔹 Update OrderStatus
const updateOrderStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const orderStatusData = req.body;
  const result = await orderStatusServices.updateOrderStatusInDB(
    id,
    orderStatusData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully!",
    data: result,
  });
});

// 🔹 Delete OrderStatus
const deleteOrderStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderStatusServices.deleteOrderStatusFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status deleted successfully!",
    data: result,
  });
});

export const orderStatusControllers = {
  getAllOrderStatus,
  getSingleOrderStatus,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
};
