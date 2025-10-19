"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const dashboard_model_1 = require("./dashboard.model");
// Create
const createDashboard = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dashboard_model_1.DashboardModel.create(payload);
    return result;
});
// Get all
const getAllDashboards = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield dashboard_model_1.DashboardModel.find()
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
});
// Get single
const getDashboardById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dashboard_model_1.DashboardModel.findById(id).populate([
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
});
// Update
const updateDashboard = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dashboard_model_1.DashboardModel.findByIdAndUpdate(id, payload, { new: true });
});
// Delete
const deleteDashboard = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dashboard_model_1.DashboardModel.findByIdAndDelete(id);
});
exports.dashboardService = {
    createDashboard,
    getAllDashboards,
    getDashboardById,
    updateDashboard,
    deleteDashboard,
};
