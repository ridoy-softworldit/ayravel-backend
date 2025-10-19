import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { CustomerSearchableFields } from "./customer.const";
import { TCustomer } from "./customer.interface";
import { CustomerModel } from "./customer.model";

const customerPopulate = [
  { path: "userId" },
  { path: "cartItem.productInfo.productId" },
  { path: "wishlist" },
  { path: "orders.orderInfo" },
];

// Create Customer
const createCustomerOnDB = async (payload: TCustomer) => {
  const result = await CustomerModel.create(payload);
  return result.populate(customerPopulate);
};

// Get All Customers with filtering, searching, sorting, pagination
const getAllCustomerFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(
    CustomerModel.find().populate(customerPopulate),
    query
  )
    .search(CustomerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.modelQuery;
  return result;
};

// Get Single Customer by ID
const getSingleCustomerFromDB = async (id: string) => {
  const result = await CustomerModel.findById(id).populate(customerPopulate);
  return result;
};

// ✅ Update Customer by ID
const updateCustomerOnDB = async (id: string, payload: Partial<TCustomer>) => {
  const result = await CustomerModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(customerPopulate);

  return result;
};

const getMyCustomerInfoFromDB = async (id: string) => {
  const result = await CustomerModel.findOne({ userId: id }).populate(
    customerPopulate
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }
  return result;
};

export const customerServices = {
  createCustomerOnDB,
  getSingleCustomerFromDB,
  getAllCustomerFromDB,
  updateCustomerOnDB,
  getMyCustomerInfoFromDB,
};
