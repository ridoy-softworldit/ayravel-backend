import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { attributeServices } from "./attributes.service";

const getAllAttributes = catchAsync(async (req, res) => {
  const result = await attributeServices.getAllAttributesFromDB(req.query as Record<string,string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attributes retrieve successfully!",
    data: result,
  });
});

const getStats = catchAsync(async (req, res) => {
  const result = await attributeServices.getStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Attributes retrieve successfully!',
    data: result,
  });
});

const getSingleAttribute = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await attributeServices.getSingleAttributeFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attribute retrieve successfully!",
    data: result,
  });
});

const createAttribute = catchAsync(async (req, res) => {
  const attributeData = req.body;
  const result = await attributeServices.createAttributeIntoDB(attributeData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attribute created successfully!",
    data: result,
  });
});

const updateAttribute = catchAsync(async (req, res) => {
  const attributeData = req.body;
  const result = await attributeServices.updateAttributeIntoDB(req.params.id,attributeData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Attribute created successfully!',
    data: result,
  });
});

export const attributeControllers = {
  getAllAttributes,
  getSingleAttribute,
  createAttribute,
  updateAttribute,
  getStats,
};
