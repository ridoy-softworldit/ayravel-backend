import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { TransferModel } from "./transfer.model";
import { TransferSearchableFields } from "./transfer.consts";
import { TTransfer } from "./transfer.interface";

const getAllTransfersFromDB = async (query: Record<string, unknown>) => {
  const transferQuery = new QueryBuilder(TransferModel.find(), query)
    .search(TransferSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await transferQuery.modelQuery;

  return result;
};

const getSingleTransferFromDB = async (id: string) => {
  const result = TransferModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Transfer does not exists!");
  }

  return result;
};

const createTransferIntoDB = async (payload: TTransfer) => {
  const result = await TransferModel.create(payload);

  return result;
};

export const transferServices = {
  getAllTransfersFromDB,
  getSingleTransferFromDB,
  createTransferIntoDB,
};
