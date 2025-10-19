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
exports.statsServices = exports.getVendorStatsFromDB = exports.getAdminStatsFromDB = void 0;
const vendor_utils_1 = require("./vendor.utils");
const admin_utils_1 = require("./admin.utils");
const getAdminStatsFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const SalesAndCostStats = yield (0, admin_utils_1.getSalesAndCostStats)(payload.days);
    const TotalOrdersStats = yield (0, admin_utils_1.getTotalOrdersStats)(payload.days);
    const UserStats = yield (0, admin_utils_1.getUserStats)(payload.days);
    const ProfitStats = yield (0, admin_utils_1.getTotalProfitStats)(payload.days);
    const TotalVendorsStats = yield (0, admin_utils_1.getTotalVendorsStats)(payload.days);
    const TotalShopsStats = yield (0, admin_utils_1.getTotalShopsStats)(payload.days);
    const TrendingProductsStats = yield (0, admin_utils_1.getTrendingProductsStats)(payload.days);
    const orderStats = yield Promise.all([
        (0, admin_utils_1.getOrderCountByStatus)('pending', payload.days),
        (0, admin_utils_1.getOrderCountByStatus)('processing', payload.days),
        (0, admin_utils_1.getOrderCountByStatus)('completed', payload.days),
        (0, admin_utils_1.getOrderCountByStatus)('cancelled', payload.days),
    ]);
    const [PendingOrder, ProcessingOrder, CompletedOrder, CancelledOrder] = orderStats;
    const TopSellingProductsStats = yield (0, admin_utils_1.getTopSellingProductsStats)();
    const TodayOrdersStats = yield (0, admin_utils_1.getTodayOrdersStats)();
    const RecentOrders = yield (0, admin_utils_1.getRecentOrders)();
    const MonthlySalesHistory = yield (0, admin_utils_1.getMonthlySalesHistory)();
    return {
        SalesAndCostStats,
        UserStats,
        TotalOrdersStats,
        ProfitStats,
        TotalVendorsStats,
        TotalShopsStats,
        TrendingProductsStats,
        PendingOrder,
        ProcessingOrder,
        CompletedOrder,
        CancelledOrder,
        TopSellingProductsStats,
        TodayOrdersStats,
        RecentOrders,
        MonthlySalesHistory,
    };
});
exports.getAdminStatsFromDB = getAdminStatsFromDB;
const getVendorStatsFromDB = (payload, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const SalesAndCostStats = yield (0, vendor_utils_1.vendorSalesAndCostStats)(payload.days, vendorId);
    const TotalOrdersStats = yield (0, vendor_utils_1.vendorTotalOrdersStats)(payload.days, vendorId);
    const ProfitStats = yield (0, vendor_utils_1.vendorTotalProfitStats)(payload.days, vendorId);
    const TotalShopsStats = yield (0, vendor_utils_1.vendorTotalShopsStats)(payload.days, vendorId);
    const TrendingProductsStats = yield (0, vendor_utils_1.vendorTrendingProductsStats)(payload.days, vendorId);
    const orderStats = yield Promise.all([
        (0, vendor_utils_1.vendorOrderCountByStatus)('pending', payload.days),
        (0, vendor_utils_1.vendorOrderCountByStatus)('processing', payload.days),
        (0, vendor_utils_1.vendorOrderCountByStatus)('completed', payload.days),
        (0, vendor_utils_1.vendorOrderCountByStatus)('cancelled', payload.days),
    ]);
    const [PendingOrder, ProcessingOrder, CompletedOrder, CancelledOrder] = orderStats;
    const TopSellingProductsStats = yield (0, vendor_utils_1.VendorTopSellingProducts)(vendorId);
    const TodayOrdersStats = yield (0, vendor_utils_1.vendorTodayOrdersStats)(vendorId);
    const RecentOrders = yield (0, vendor_utils_1.vendorRecentOrders)();
    const MonthlySalesHistory = yield (0, vendor_utils_1.vendorMonthlySalesHistory)(vendorId);
    return {
        SalesAndCostStats,
        TotalOrdersStats,
        ProfitStats,
        // TotalVendorsStats,
        TotalShopsStats,
        PendingOrder,
        ProcessingOrder,
        CompletedOrder,
        CancelledOrder,
        TopSellingProductsStats,
        TrendingProductsStats,
        TodayOrdersStats,
        RecentOrders,
        MonthlySalesHistory,
    };
});
exports.getVendorStatsFromDB = getVendorStatsFromDB;
exports.statsServices = { getAdminStatsFromDB: exports.getAdminStatsFromDB, getVendorStatsFromDB: exports.getVendorStatsFromDB };
