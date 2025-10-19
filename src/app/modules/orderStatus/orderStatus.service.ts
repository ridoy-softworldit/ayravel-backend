import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { OrderStatus } from "./orderStatus.model";
import { TOrderStatus } from "./orderStatus.interface";
import { OrderStatusSearchableFields } from "./orderStatus.const";

const getAllOrderStatusFromDB = async (query: Record<string, unknown>) => {
  const orderStatusQuery = new QueryBuilder(OrderStatus.find(), query)
    .search(OrderStatusSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderStatusQuery.modelQuery;

  return result;
};


const getSingleOrderStatusFromDB = async (id: string) => {
  const result = await OrderStatus.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
  }

  return result;
};


const createOrderStatusIntoDB = async (payload: TOrderStatus) => {
  const result = await OrderStatus.create(payload);

  return result;
};


const updateOrderStatusInDB = async (
  id: string,
  payload: Partial<TOrderStatus>
) => {
  const result = await OrderStatus.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
  }

  return result;
};

// 🔹 Delete OrderStatus
const deleteOrderStatusFromDB = async (id: string) => {
  const result = await OrderStatus.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "OrderStatus does not exist!");
  }

  return result;
};

export const orderStatusServices = {
  getAllOrderStatusFromDB,
  getSingleOrderStatusFromDB,
  createOrderStatusIntoDB,
  updateOrderStatusInDB,
  deleteOrderStatusFromDB,
};
