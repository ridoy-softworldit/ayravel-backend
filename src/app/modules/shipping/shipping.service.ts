import QueryBuilder from "../../builder/QueryBuilder";
import { TShipping } from "./shipping.interface";
import { ShippingModel } from "./shipping.model";

const createShippingOnDB = async (payload: TShipping) => {
  const result = await ShippingModel.create(payload);
  return result;
};

const getAllShippingFromDB = async (query: Record<string, unknown>) => {
  const shippingQuery = new QueryBuilder(ShippingModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await shippingQuery.modelQuery;
  return result;
};

const getSingleShippingFromDB = async (id: string) => {
  const result = await ShippingModel.findById(id);
  return result;
};

export const shippingServices = {
  createShippingOnDB,
  getAllShippingFromDB,
  getSingleShippingFromDB,
};
