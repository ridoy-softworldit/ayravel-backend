import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./order.service";

const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieve successfully!",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const customerId = req.params.id;

  const result = await orderServices.getMyOrdersFromDB(customerId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully!",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.getSingleOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieve successfully!",
    data: result,
  });
});

/**
 * ✅ Get Order Summary Controller
 */
const getOrderSummary = catchAsync(async (req, res) => {
  const summary = await orderServices.getOrderSummaryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order summary fetched successfully",
    data: summary,
  });
});

// ✅ Get Commission Summary Controller
const getUserCommissionSummary = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderServices.getUserCommissionSummaryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User commission summary retrieved successfully!",
    data: result,
  });
});

// const createOrder = catchAsync(async (req, res) => {
//   const orderData = req.body;
//   const result = await orderServices.createOrderIntoDB(orderData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order created successfully!",
//     data: result,
//   });
// });

// Create Order Controller with Auth Integration

const createOrder = catchAsync(async (req, res) => {
  const user = req.user || null; // if logged in (from auth middleware)
  const orderData = req.body;

  // Attach logged-in user's ID if available
  if (user) {
    const userId = (user as any)._id ?? (user as any).id;
    orderData.orderInfo = orderData.orderInfo.map((order: any) => ({
      ...order,
      orderBy: userId,
    }));
  }

  const result = await orderServices.createOrderIntoDB(orderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: user
      ? "Order created successfully!"
      : "Order created successfully as guest!",
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await orderServices.updateOrderInDB(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully!",
    data: result,
  });
});

// Update Order Status Controller
const updateOrderStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new Error("Status field is required");
  }

  const result = await orderServices.updateOrderStatusInDB(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully!",
    data: result,
  });
});

export const orderControllers = {
  getAllOrder,
  getSingleOrder,
  getUserCommissionSummary,
  createOrder,
  updateOrderStatus,
  updateOrder,
  getOrderSummary,
  getMyOrders,
};
