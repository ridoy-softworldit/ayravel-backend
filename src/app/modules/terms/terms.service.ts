import QueryBuilder from "../../builder/QueryBuilder";
import { TTermsAndConditions } from "./terms.interface";
import { TermsModel } from "./terms.model";

const createTermsOnDB = async (payload: TTermsAndConditions) => {
  const result = await TermsModel.create(payload);
  return result;
};

const getAllTermsFromDB = async (query: Record<string, unknown>) => {
  const termsQuery = new QueryBuilder(TermsModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await termsQuery.modelQuery;
  return result;
};

const getSingleTermsFromDB = async (id: string) => {
  const result = await TermsModel.findById(id);
  return result;
};

export const termsServices = {
  createTermsOnDB,
  getAllTermsFromDB,
  getSingleTermsFromDB,
};
