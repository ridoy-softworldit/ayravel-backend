import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { taxServices } from "./taxs.service";

const getAllTaxes = catchAsync(async (req, res) => {
  const result = await taxServices.getAllTaxesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Taxes retrieved successfully!",
    data: result,
  });
});

const getSingleTax = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await taxServices.getSingleTaxFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax retrieved successfully!",
    data: result,
  });
});

const createTax = catchAsync(async (req, res) => {
  const taxData = req.body;
  const result = await taxServices.createTaxOnDB(taxData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tax created successfully!",
    data: result,
  });
});

export const taxControllers = {
  createTax,
  getSingleTax,
  getAllTaxes,
};
