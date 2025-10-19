import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { ShopModel } from "./shop.model";
import { ShopSearchableFields } from "./shop.const";
import { TShop, TShopDeletedBy, TShopStatusToggle } from "./shop.interface";
import { UserModel } from "../user/user.model";
import { ProductModel } from "../product/product.model";
import { OrderModel } from "../order/order.model";

const getAllShopsFromDB = async (query: Record<string, unknown>) => {
  const shopQuery = new QueryBuilder(ShopModel.find(), query)
    .search(ShopSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await shopQuery.modelQuery
    .populate("vendorId")
    .populate("staffs")
    .populate("products")
    .populate("orders")
    .populate("transactions")
    .populate("withdrawals")
    .populate("attributes")
    .populate("coupons");

  return result;
};

const getSingleShopFromDB = async (id: string) => {
  const result = await ShopModel.findById(id)
    .populate("vendorId")
    .populate("staffs")
    .populate("products")
    .populate("orders")
    .populate("transactions")
    .populate("withdrawals")
    .populate("attributes")
    .populate("coupons");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop does not exists!");
  }

  return result;
};

const getShopStatsFromDB = async () => {
  const totalShops = await ShopModel.countDocuments();
  const totalProducts = await ProductModel.countDocuments();
  const totalOrders = await OrderModel.countDocuments();

  const revenueAgg = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  const shopStatusAgg = await ShopModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts: Record<string, number> = {
    active: 0,
    inactive: 0,
    pending: 0,
  };
  shopStatusAgg.forEach((s) => {
    statusCounts[s._id] = s.count;
  });

  return {
    totalShops,
    activeShops: statusCounts.active,
    inactiveShops: statusCounts.inactive,
    pendingShops: statusCounts.pending,
    totalProducts,
    totalOrders,
    totalRevenue,
  };
};

const createShopIntoDB = async (userId: string, payload: TShop) => {
  const isUserExists = await UserModel.findById(userId);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exists!");
  }

  if (isUserExists?.role !== "admin" && isUserExists?.role !== "vendor") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const isVendorExists = await UserModel.findById(payload?.vendorId);

  if (!isVendorExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User isn't a valid vendor!");
  }

  if (
    isUserExists.role === "vendor" &&
    isUserExists._id.toString() !== String(payload.vendorId)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized vendor access!");
  }
  const result = await ShopModel.create(payload);
  return result;
};

const toggleShopActiveStatusIntoDB = async (
  id: string,
  payload: TShopStatusToggle
) => {
  const isUserExists = await UserModel.findById(payload?.updatedBy);

  if (!isUserExists || isUserExists.role !== "admin") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const isShopExists = await ShopModel.findByIdAndUpdate(
    id,
    {
      status: payload?.status,
    },
    { new: true }
  );

  if (!isShopExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found!");
  }

  return isShopExists;
};

const updateShopIntoDB = async (
  id: string,
  userId: string,
  payload: Partial<TShop>
) => {
  const isUserExists = await UserModel.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const shop = await ShopModel.findById(id);
  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found!");
  }

  if (
    isUserExists.role !== "admin" &&
    !(isUserExists.role === "vendor" && shop.vendorId.toString() === userId)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const updatedShop = await ShopModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedShop;
};

const deleteShopFromDB = async (ShopId: string, payload: TShopDeletedBy) => {
  const isShopExists = await ShopModel.findById(ShopId);
  if (!isShopExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found!");
  }

  const isUserExists = await UserModel.findById(payload?.deletedBy);
  if (!isUserExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found!");
  }

  const isAdmin = isUserExists.role === "admin";
  const isVendor =
    payload.deletedBy.toString() === isShopExists.vendorId.toString();

  if (!isAdmin && !isVendor) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const result = await ShopModel.findByIdAndDelete(ShopId);
  return result;
};

const getMyShopDataFromDB = async (vendorId: string) => {
  // 1. Get all shops of this vendor
  const shops = await ShopModel.find({ vendorId })
    .populate("vendorId")
    .populate("staffs")
    .populate("products")
    .populate("orders")
    .populate("transactions")
    .populate("withdrawals")
    .populate("attributes")
    .populate("coupons");

  if (!shops.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No shops found for this vendor!");
  }

  // Shop IDs
  const shopIds = shops.map((shop) => shop._id);

  // 2. Total product count
  const totalProducts = shops.reduce(
    (acc, shop) => acc + (shop.products?.length || 0),
    0
  );

  // 3. Orders that belong to these shops
  const orders = await OrderModel.find({
    "orderInfo.shopInfo": { $in: shopIds },
  });

  const totalOrders = orders.length;

  // 4. Total revenue (sum of all order.totalAmount)
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  // 5. Unique customers
  const customerSet = new Set<string>();
  orders.forEach((order) => {
    if (order.customerInfo?.email) {
      customerSet.add(order.customerInfo.email);
    }
  });
  const totalCustomers = customerSet.size;

  return {
    shops,
    summary: {
      totalShops: shops.length,
      totalProducts,
      totalRevenue,
      totalOrders,
      totalCustomers,
    },
  };
};

export const shopServices = {
  getAllShopsFromDB,
  getSingleShopFromDB,
  getShopStatsFromDB,
  createShopIntoDB,
  toggleShopActiveStatusIntoDB,
  updateShopIntoDB,
  deleteShopFromDB,
  getMyShopDataFromDB,
};
