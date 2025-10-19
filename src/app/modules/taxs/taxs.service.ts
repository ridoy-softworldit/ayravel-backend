import QueryBuilder from "../../builder/QueryBuilder";
import { TTax } from "./taxs.interface";
import { TaxModel } from "./taxs.model";

const createTaxOnDB = async (payload: TTax) => {
  const result = await TaxModel.create(payload);
  return result;
};

const getAllTaxesFromDB = async (query: Record<string, unknown>) => {
  const taxQuery = new QueryBuilder(TaxModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await taxQuery.modelQuery;
  return result;
};

const getSingleTaxFromDB = async (id: string) => {
  const result = await TaxModel.findById(id);
  return result;
};

export const taxServices = {
  createTaxOnDB,
  getAllTaxesFromDB,
  getSingleTaxFromDB,
};
