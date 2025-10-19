import { DashboardModel } from "./dashboard.model";
import { TDashboard } from "./dashboard.interface";

// Create
const createDashboard = async (payload: TDashboard) => {
  const result = await DashboardModel.create(payload);
  return result;
};

// Get all
const getAllDashboards = async () => {
  return await DashboardModel.find()
    .populate("summary")
    .populate("orderStatus")
    .populate("recentOrders")
    .populate("salesHistory")
    .populate("popularProducts")
    .populate("lowStockProducts")
    .populate("topCategoryWithProducts")
    .populate("withdrawals")
    .populate("attributes")
    .populate("taxes")
    .populate("shippings")
    .populate("orders")
    .populate("transactions")
    .populate("faqs")
    .populate("users")
    .populate("vendors")
    .populate("customers")
    .populate("coupons");
};

// Get single
const getDashboardById = async (id: string) => {
  return await DashboardModel.findById(id).populate([
    "summary",
    "orderStatus",
    "recentOrders",
    "salesHistory",
    "popularProducts",
    "lowStockProducts",
    "topCategoryWithProducts",
    "withdrawals",
    "attributes",
    "taxes",
    "shippings",
    "orders",
    "transactions",
    "faqs",
    "users",
    "vendors",
    "customers",
    "coupons",
  ]);
};

// Update
const updateDashboard = async (id: string, payload: Partial<TDashboard>) => {
  return await DashboardModel.findByIdAndUpdate(id, payload, { new: true });
};

// Delete
const deleteDashboard = async (id: string) => {
  return await DashboardModel.findByIdAndDelete(id);
};

export const dashboardService = {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
};
