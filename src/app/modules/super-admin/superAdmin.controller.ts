import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { superAdminServices } from "./superAdmin.service";

const getAllSuperAdmin = catchAsync(async (req, res) => {
  const result = await superAdminServices.getAllSuperAdminFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SuperAdmins retrieved successfully!",
    data: result,
  });
});

const getSingleSuperAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await superAdminServices.getSingleSuperAdminFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SuperAdmin retrieved successfully!",
    data: result,
  });
});

const createSuperAdmin = catchAsync(async (req, res) => {
  const superAdminData = req.body;
  const result = await superAdminServices.createSuperAdminOnDB(superAdminData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SuperAdmin created successfully!",
    data: result,
  });
});

export const superAdminControllers = {
  createSuperAdmin,
  getSingleSuperAdmin,
  getAllSuperAdmin,
};
