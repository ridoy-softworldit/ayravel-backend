import QueryBuilder from "../../builder/QueryBuilder";
import { SuperAdmin } from "./superAdmin.model";
import { TSuperAdmin } from "./superAdmin.interface";

const createSuperAdminOnDB = async (payload: TSuperAdmin) => {
  const result = await SuperAdmin.create(payload);
  return result;
};

const getAllSuperAdminFromDB = async (query: Record<string, unknown>) => {
  const superAdminQuery = new QueryBuilder(SuperAdmin.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await superAdminQuery.modelQuery;
  return result;
};

const getSingleSuperAdminFromDB = async (id: string) => {
  const result = await SuperAdmin.findById(id);
  return result;
};

export const superAdminServices = {
  createSuperAdminOnDB,
  getAllSuperAdminFromDB,
  getSingleSuperAdminFromDB,
};
