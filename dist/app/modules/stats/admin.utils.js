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
exports.getTrendingProductsStats = exports.getMonthlySalesHistory = exports.getRecentOrders = exports.getTodayOrdersStats = exports.getTopSellingProductsStats = exports.getOrderCountByStatus = exports.getTotalShopsStats = exports.getTotalVendorsStats = exports.getTotalProfitStats = exports.getTotalOrdersStats = exports.getUserStats = exports.getSalesAndCostStats = void 0;
const user_model_1 = require("../user/user.model");
const order_model_1 = require("../order/order.model");
const vendor_model_1 = require("../vendor/vendor.model");
const shop_model_1 = require("../shop/shop.model");
const getSalesAndCostStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (days - 1));
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: today },
            },
        },
        {
            $unwind: '$orderInfo',
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                totalSales: { $sum: '$orderInfo.totalAmount.total' },
                totalCost: { $sum: '$orderInfo.totalAmount.subTotal' },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: '$_id',
                totalSales: 1,
                totalCost: 1,
            },
        },
    ]);
    const allOrders = yield order_model_1.OrderModel.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                dailySales: { $sum: '$totalAmount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    let maxSales = 0;
    for (let i = 0; i <= allOrders.length - days; i++) {
        const windowSum = allOrders
            .slice(i, i + days)
            .reduce((sum, d) => sum + d.dailySales, 0);
        if (windowSum > maxSales)
            maxSales = windowSum;
    }
    const stats = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const found = result.find(r => r.date === dateStr);
        stats.push({
            date: dateStr,
            day: dayName,
            totalSales: (found === null || found === void 0 ? void 0 : found.totalSales) || 0,
            totalCost: (found === null || found === void 0 ? void 0 : found.totalCost) || 0,
        });
    }
    const totalSalesSum = stats.reduce((sum, d) => sum + d.totalSales, 0);
    const totalCostSum = stats.reduce((sum, d) => sum + d.totalCost, 0);
    return {
        days,
        totalSalesSum,
        totalCostSum,
        maxSales: maxSales,
        stats,
        isCurrentAboveMax: totalSalesSum > maxSales,
    };
});
exports.getSalesAndCostStats = getSalesAndCostStats;
const getUserStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    var _a, _b, _c, _d;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - days);
    const result = yield user_model_1.UserModel.aggregate([
        {
            $facet: {
                currentPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: startDate, $lte: endDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ],
                previousPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: previousStartDate, $lte: startDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        },
    ]);
    const currentTotal = ((_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.currentPeriod[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
    const previousTotal = ((_d = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.previousPeriod[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
    let percentChange = null;
    let trend = 'neutral';
    if (previousTotal > 0) {
        percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
    }
    else if (currentTotal > 0) {
        percentChange = null; // no previous data
    }
    return {
        totalUsers: currentTotal,
        percentChange: percentChange !== null ? Number(percentChange.toFixed(2)) : null,
        trend,
        comparedTo: `Last ${days} days`,
    };
});
exports.getUserStats = getUserStats;
const getTotalOrdersStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    var _a, _b, _c, _d;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - days);
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $facet: {
                currentPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: startDate, $lte: endDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ],
                previousPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: previousStartDate, $lte: startDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        },
    ]);
    const currentTotal = ((_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.currentPeriod[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
    const previousTotal = ((_d = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.previousPeriod[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
    let percentChange = 0;
    if (previousTotal > 0) {
        percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
    }
    else if (currentTotal > 0) {
        percentChange = 100;
    }
    return {
        totalOrders: currentTotal,
        percentChange: Number(percentChange.toFixed(2)),
        comparedTo: `Last ${days} days`,
    };
});
exports.getTotalOrdersStats = getTotalOrdersStats;
const getTotalProfitStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    var _a, _b, _c, _d;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - days);
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $facet: {
                currentPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: startDate, $lte: endDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalSales: { $sum: '$totalAmount' },
                        },
                    },
                ],
                previousPeriod: [
                    {
                        $match: {
                            createdAt: { $gte: previousStartDate, $lte: startDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalSales: { $sum: '$totalAmount' },
                        },
                    },
                ],
            },
        },
    ]);
    const currentSales = ((_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.currentPeriod[0]) === null || _b === void 0 ? void 0 : _b.totalSales) || 0;
    const previousSales = ((_d = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.previousPeriod[0]) === null || _d === void 0 ? void 0 : _d.totalSales) || 0;
    let percentChange = null;
    let trend = 'neutral';
    if (previousSales > 0) {
        percentChange = ((currentSales - previousSales) / previousSales) * 100;
        trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
    }
    else if (currentSales > 0) {
        percentChange = null; // আগের ডেটা না থাকলে
    }
    return {
        totalSales: Number(currentSales.toFixed(2)),
        percentChange: percentChange !== null ? Number(percentChange.toFixed(2)) : null,
        trend,
        comparedTo: `Last ${days} days`,
    };
});
exports.getTotalProfitStats = getTotalProfitStats;
const getTotalVendorsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const totalVendors = yield vendor_model_1.VendorModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
    });
    return {
        totalVendors,
        comparedTo: `Last ${days} days`,
    };
});
exports.getTotalVendorsStats = getTotalVendorsStats;
const getTotalShopsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const totalShops = yield shop_model_1.ShopModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
    });
    return {
        totalShops,
        comparedTo: `Last ${days} days`,
    };
});
exports.getTotalShopsStats = getTotalShopsStats;
const getOrderCountByStatus = (status_1, ...args_1) => __awaiter(void 0, [status_1, ...args_1], void 0, function* (status, days = 7) {
    var _a;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (days - 1));
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: today },
                'orderInfo.status': status,
            },
        },
        {
            $project: {
                matchedOrders: {
                    $size: {
                        $filter: {
                            input: '$orderInfo',
                            as: 'item',
                            cond: { $eq: ['$$item.status', status] },
                        },
                    },
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$matchedOrders' },
            },
        },
    ]);
    const totalOrders = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    return {
        status,
        totalOrders,
        comparedTo: `Last ${days} days`,
    };
});
exports.getOrderCountByStatus = getOrderCountByStatus;
const getTopSellingProductsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 365) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const topSellingProducts = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                'orderInfo.isCancelled': { $ne: true },
            },
        },
        {
            $unwind: '$orderInfo',
        },
        {
            $group: {
                _id: '$orderInfo.productInfo',
                totalSales: { $sum: '$orderInfo.totalAmount.total' },
            },
        },
        {
            $sort: { totalSales: -1 },
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $unwind: '$productDetails',
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'productDetails.brandAndCategories.categories',
                foreignField: '_id',
                as: 'categoryDetails',
            },
        },
        {
            $project: {
                _id: 0,
                product: '$productDetails.featuredImg',
                productName: '$productDetails.description.name',
                category: { $arrayElemAt: ['$categoryDetails.name', 0] },
                stock: {
                    $cond: {
                        if: { $gt: ['$productDetails.productInfo.quantity', 0] },
                        then: 'Available',
                        else: 'Sold Out',
                    },
                },
                totalSales: { $round: ['$totalSales', 2] },
            },
        },
    ]);
    return topSellingProducts;
});
exports.getTopSellingProductsStats = getTopSellingProductsStats;
const getTodayOrdersStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayOrders = yield order_model_1.OrderModel.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
        {
            $project: {
                hour: { $hour: { date: '$createdAt', timezone: '+06:00' } },
            },
        },
        { $group: { _id: '$hour', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    const yesterdayOrders = yield order_model_1.OrderModel.aggregate([
        { $match: { createdAt: { $gte: yesterday, $lt: today } } },
        { $count: 'count' },
    ]);
    const todayCount = todayOrders.reduce((sum, r) => sum + r.count, 0);
    const yesterdayCount = ((_a = yesterdayOrders[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    const percentChange = yesterdayCount === 0
        ? todayCount > 0
            ? 100
            : 0
        : ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    const formatHourLabel = (hour) => {
        if (hour === 0)
            return '12 AM';
        if (hour < 12)
            return `${hour} AM`;
        if (hour === 12)
            return '12 PM';
        return `${hour - 12} PM`;
    };
    const todayHourlyData = todayOrders.map(item => ({
        hourLabel: formatHourLabel(item._id),
        count: item.count,
    }));
    return {
        todayCount,
        percentChange: Number(percentChange.toFixed(1)),
        todayHourlyData,
    };
});
exports.getTodayOrdersStats = getTodayOrdersStats;
const getRecentOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(5);
    return result;
});
exports.getRecentOrders = getRecentOrders;
const getMonthlySalesHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                'orderInfo.status': { $ne: 'cancelled' },
            },
        },
        {
            $addFields: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
            },
        },
        {
            $group: {
                _id: { month: '$month', year: '$year' },
                totalSales: { $sum: '$totalAmount' },
                orderCount: { $sum: 1 },
            },
        },
        {
            $addFields: {
                monthName: {
                    $arrayElemAt: [
                        [
                            '',
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                        '$_id.month',
                    ],
                },
            },
        },
        {
            $project: {
                _id: 0,
                monthName: 1,
                year: '$_id.year',
                totalSales: 1,
                orderCount: 1,
            },
        },
        {
            $sort: { year: -1, _id: -1 },
        },
    ]);
    return result;
});
exports.getMonthlySalesHistory = getMonthlySalesHistory;
const getTrendingProductsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
    const today = new Date();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(today.getDate() - (days - 1));
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: today },
            },
        },
        { $unwind: '$orderInfo' },
        {
            $group: {
                _id: '$orderInfo.productInfo',
                totalSold: { $sum: '$orderInfo.quantity' },
                totalRevenue: { $sum: '$orderInfo.totalAmount.total' },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $project: {
                _id: 1,
                totalSold: 1,
                totalRevenue: 1,
                name: '$product.description.name',
                featuredImg: '$product.featuredImg',
                price: '$product.productInfo.price',
                salePrice: '$product.productInfo.salePrice',
            },
        },
    ]);
    return {
        comparedTo: `Last ${days} days`,
        trendingProducts: result,
    };
});
exports.getTrendingProductsStats = getTrendingProductsStats;
