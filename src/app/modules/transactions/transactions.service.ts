import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { TransactionsSearchableFields } from "./transactions.const";
import { TTransaction } from "./transactions.interface";
import { TransactionModel } from "./transactions.model";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

const getAllTransactionsFromDB = async (query: Record<string, unknown>) => {
  const transactionQuery = new QueryBuilder(TransactionModel.find(), query)
    .search(TransactionsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await transactionQuery.modelQuery;

  return result;
};

const getSingleTransactionFromDB = async (id: string) => {
  const result = await TransactionModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "No transaction found!");
  }

  return result;
};

const createTransactionOnDB = async (payload: TTransaction) => {
  if (payload?.trackingNumber) {
    const isTransactionExists = await TransactionModel.findOne({
      trackingNumber: payload?.trackingNumber,
    });
    if (isTransactionExists) {
      throw new AppError(httpStatus.CONFLICT, "Transaction already happen!");
    }
  }
  payload.trackingNumber = uuidv4();

  const result = await TransactionModel.create(payload);

  return result;
};

export const transactionServices = {
  createTransactionOnDB,
  getSingleTransactionFromDB,
  getAllTransactionsFromDB,
};
