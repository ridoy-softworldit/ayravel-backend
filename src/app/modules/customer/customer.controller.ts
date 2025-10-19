import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { customerServices } from "./customer.service";

const getAllCustomer = catchAsync(async (req, res) => {
  const result = await customerServices.getAllCustomerFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers retrieved successfully!",
    data: result,
  });
});

const getSingleCustomer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await customerServices.getSingleCustomerFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer retrieved successfully!",
    data: result,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const customerData = req.body;
  const result = await customerServices.createCustomerOnDB(customerData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Customer created successfully!",
    data: result,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const customerId = req.params.id;
  console.log(customerId);
  const result = await customerServices.updateCustomerOnDB(
    customerId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer updated successfully!",
    data: result,
  });
});

const getMyCustomerInfo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await customerServices.getMyCustomerInfoFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer retrieved successfully!",
    data: result,
  });
});

export const customerControllers = {
  createCustomer,
  getSingleCustomer,
  getAllCustomer,
  updateCustomer,
  getMyCustomerInfo,
};
