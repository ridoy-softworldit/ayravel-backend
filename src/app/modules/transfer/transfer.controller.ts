import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { transferServices } from "./transfer.service";

const getAllTransfer = catchAsync(async (req, res) => {
  const result = await transferServices.getAllTransfersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieve successfully!",
    data: result,
  });
});

const getSingleTransfer = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await transferServices.getSingleTransferFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transfer retrieve successfully!",
    data: result,
  });
});

const createTransfer = catchAsync(async (req, res) => {
  const transferData = req.body;
  const result = await transferServices.createTransferIntoDB(transferData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transfer created successfully!",
    data: result,
  });
});

export const transferControllers = {
  getAllTransfer,
  getSingleTransfer,
  createTransfer,
};
