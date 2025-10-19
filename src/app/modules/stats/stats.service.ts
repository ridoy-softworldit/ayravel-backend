import { vendorMonthlySalesHistory, vendorOrderCountByStatus, vendorRecentOrders, vendorSalesAndCostStats, vendorTodayOrdersStats, VendorTopSellingProducts, vendorTotalOrdersStats, vendorTotalProfitStats, vendorTotalShopsStats, vendorTrendingProductsStats } from "./vendor.utils";
import { IAdminStatsPropsValues } from "./stats.interface";
import {  getMonthlySalesHistory, getOrderCountByStatus, getRecentOrders, getSalesAndCostStats, getTodayOrdersStats, getTopSellingProductsStats, getTotalOrdersStats, getTotalProfitStats, getTotalShopsStats, getTotalVendorsStats, getTrendingProductsStats, getUserStats } from "./admin.utils";


export const getAdminStatsFromDB = async (payload: IAdminStatsPropsValues) => {
  const SalesAndCostStats = await getSalesAndCostStats(payload.days);
  const TotalOrdersStats = await getTotalOrdersStats(payload.days);
  const UserStats = await getUserStats(payload.days);
  const ProfitStats = await getTotalProfitStats(payload.days);
  const TotalVendorsStats = await getTotalVendorsStats(payload.days);
  const TotalShopsStats = await getTotalShopsStats(payload.days);
  const TrendingProductsStats = await getTrendingProductsStats(payload.days);

  const orderStats = await Promise.all([
    getOrderCountByStatus('pending', payload.days),
    getOrderCountByStatus('processing', payload.days),
    getOrderCountByStatus('completed', payload.days),
    getOrderCountByStatus('cancelled', payload.days),
  ]);
  const [PendingOrder, ProcessingOrder, CompletedOrder, CancelledOrder] = orderStats;

  const TopSellingProductsStats = await getTopSellingProductsStats()
  const TodayOrdersStats = await getTodayOrdersStats();
  const RecentOrders = await getRecentOrders();
  const MonthlySalesHistory = await getMonthlySalesHistory();
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
};


export const getVendorStatsFromDB = async (payload: IAdminStatsPropsValues, vendorId: string) => {
  const SalesAndCostStats = await vendorSalesAndCostStats(payload.days, vendorId);
  const TotalOrdersStats = await vendorTotalOrdersStats(payload.days, vendorId);
  const ProfitStats = await vendorTotalProfitStats(payload.days, vendorId);
  const TotalShopsStats = await vendorTotalShopsStats(payload.days, vendorId);
  const TrendingProductsStats = await vendorTrendingProductsStats(payload.days, vendorId);
  const orderStats = await Promise.all([
    vendorOrderCountByStatus('pending', payload.days),
    vendorOrderCountByStatus('processing', payload.days),
    vendorOrderCountByStatus('completed', payload.days),
    vendorOrderCountByStatus('cancelled', payload.days),
  ]);
  const [PendingOrder, ProcessingOrder, CompletedOrder, CancelledOrder] =
    orderStats;

  const TopSellingProductsStats = await VendorTopSellingProducts(vendorId);
  const TodayOrdersStats = await vendorTodayOrdersStats(vendorId);
  const RecentOrders = await vendorRecentOrders();
  const MonthlySalesHistory = await vendorMonthlySalesHistory(vendorId);
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
};







export const statsServices = { getAdminStatsFromDB, getVendorStatsFromDB };