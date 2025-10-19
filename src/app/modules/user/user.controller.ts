import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All user data retrieve successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieve successfully!",
    data: result,
  });
});

const getAllAdminUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All admin data retrieve successfully!",
    data: result,
  });
});

const getSuperAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.getAdminProfileFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Super admin data retrieve successfully!",
    data: result,
  });
});

const getAllVendorUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllVendorFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All vendor data retrieve successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await UserServices.updateUserOnDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUser,
  getAllAdminUser,
  getSuperAdmin,
  getAllVendorUser,
  updateUser,
};
