import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { TSalesHistory } from "./salesHistory.interface";
import { SalesHistoryModel } from "./salesHistory.model";

const getAllSalesHistoryFromDB = async (query: Record<string, unknown>) => {
  const historyQuery = new QueryBuilder(SalesHistoryModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await historyQuery.modelQuery;
  return result;
};

const getSingleSalesHistoryFromDB = async (id: string) => {
  const result = await SalesHistoryModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Sales history not found!");
  }

  return result;
};

const createSalesHistoryIntoDB = async (payload: TSalesHistory) => {
  const result = await SalesHistoryModel.create(payload);
  return result;
};

export const salesHistoryServices = {
  getAllSalesHistoryFromDB,
  getSingleSalesHistoryFromDB,
  createSalesHistoryIntoDB,
};
