import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { dashboardService } from "./dashboard.service";

// Create
const createDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.createDashboard(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Dashboard created successfully",
    data: result,
  });
});

// Get all
const getAllDashboards = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getAllDashboards();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboards fetched successfully",
    data: result,
  });
});

// Get single
const getDashboardById = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getDashboardById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard fetched successfully",
    data: result,
  });
});

// Update
const updateDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.updateDashboard(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard updated successfully",
    data: result,
  });
});

// Delete
const deleteDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.deleteDashboard(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard deleted successfully",
    data: result,
  });
});

export const dashboardControllers = {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
};
