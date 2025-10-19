import QueryBuilder from "../../builder/QueryBuilder";
import { VendorSearchableFields } from "./vendor.consts";
import { TVendor } from "./vendor.interface";
import { VendorModel } from "./vendor.model";

const createVendorOnDB = async (payload: TVendor) => {
  const result = await VendorModel.create(payload);
  return result;
};

const getAllVendorFromDB = async (query: Record<string, unknown>) => {
  const vendorQuery = new QueryBuilder(VendorModel.find(), query)
    .search(VendorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await vendorQuery.modelQuery;
  return result;
};
const getSingleVendorFromDB = async (id: string) => {
  const result = await VendorModel.findById(id);
  return result;
};

export const vendorServices = {
  createVendorOnDB,
  getAllVendorFromDB,
  getSingleVendorFromDB,
};
