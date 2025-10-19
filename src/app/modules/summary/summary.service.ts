import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { SummaryModel } from "./summary.model";
import { TSummary } from "./summary.interface";
import { SummarySearchableFields } from "./summary.consts";

// 🔹 Get all summaries
const getAllSummariesFromDB = async (query: Record<string, unknown>) => {
  const summaryQuery = new QueryBuilder(SummaryModel.find(), query)
    .search(SummarySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await summaryQuery.modelQuery;
  return result;
};

// 🔹 Get single summary by ID
const getSingleSummaryFromDB = async (id: string) => {
  const result = await SummaryModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Summary does not exist!");
  }

  return result;
};

// 🔹 Create new summary
const createSummaryIntoDB = async (payload: TSummary) => {
  const result = await SummaryModel.create(payload);
  return result;
};

// 🔹 Update summary
const updateSummaryInDB = async (id: string, payload: Partial<TSummary>) => {
  const result = await SummaryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Summary does not exist!");
  }

  return result;
};

// 🔹 Delete summary
const deleteSummaryFromDB = async (id: string) => {
  const result = await SummaryModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Summary does not exist!");
  }

  return result;
};

export const summaryServices = {
  getAllSummariesFromDB,
  getSingleSummaryFromDB,
  createSummaryIntoDB,
  updateSummaryInDB,
  deleteSummaryFromDB,
};
