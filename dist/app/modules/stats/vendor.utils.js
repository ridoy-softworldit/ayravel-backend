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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorMonthlySalesHistory = exports.vendorRecentOrders = exports.vendorTodayOrdersStats = exports.VendorTopSellingProducts = exports.vendorTrendingProductsStats = exports.vendorTotalShopsStats = exports.vendorOrderCountByStatus = exports.vendorTotalProfitStats = exports.vendorTotalOrdersStats = exports.vendorSalesAndCostStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../order/order.model");
const shop_model_1 = require("../shop/shop.model");
const vendorSalesAndCostStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7, vendorId) {
    const today = new Date();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(today.getDate() - (days - 1));
    const vendorObjectId = vendorId
        ? new mongoose_1.default.Types.ObjectId(vendorId)
        : null;
    const matchFilter = {
        createdAt: { $gte: startDate, $lte: today },
    };
    if (vendorObjectId) {
        matchFilter['orderInfo.vendorId'] = vendorObjectId;
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        { $match: matchFilter },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
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
        { $unwind: '$orderInfo' },
        {
            $match: vendorObjectId ? { 'orderInfo.vendorId': vendorObjectId } : {},
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                dailySales: { $sum: '$orderInfo.totalAmount.total' },
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
        maxSales,
        stats,
        isCurrentAboveMax: totalSalesSum > maxSales,
    };
});
exports.vendorSalesAndCostStats = vendorSalesAndCostStats;
const vendorTotalOrdersStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7, vendorId) {
    var _a, _b, _c, _d;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - days);
    const matchFilter = {
        createdAt: { $gte: startDate, $lte: endDate },
    };
    const prevMatchFilter = {
        createdAt: { $gte: previousStartDate, $lte: startDate },
    };
    if (vendorId) {
        const vendorObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
        matchFilter['orderInfo.vendorId'] = vendorObjectId;
        prevMatchFilter['orderInfo.vendorId'] = vendorObjectId;
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        {
            $facet: {
                currentPeriod: [
                    { $match: matchFilter },
                    { $group: { _id: null, count: { $sum: 1 } } },
                ],
                previousPeriod: [
                    { $match: prevMatchFilter },
                    { $group: { _id: null, count: { $sum: 1 } } },
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
exports.vendorTotalOrdersStats = vendorTotalOrdersStats;
const vendorTotalProfitStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7, vendorId) {
    var _a, _b, _c, _d;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - days);
    const matchFilter = {
        createdAt: { $gte: startDate, $lte: endDate },
    };
    const prevMatchFilter = {
        createdAt: { $gte: previousStartDate, $lte: startDate },
    };
    if (vendorId) {
        const vendorObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
        matchFilter['orderInfo.vendorId'] = vendorObjectId;
        prevMatchFilter['orderInfo.vendorId'] = vendorObjectId;
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        {
            $facet: {
                currentPeriod: [
                    { $match: matchFilter },
                    {
                        $group: {
                            _id: null,
                            totalSales: { $sum: '$orderInfo.totalAmount.total' },
                        },
                    },
                ],
                previousPeriod: [
                    { $match: prevMatchFilter },
                    {
                        $group: {
                            _id: null,
                            totalSales: { $sum: '$orderInfo.totalAmount.total' },
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
        percentChange = null;
    }
    return {
        totalSales: Number(currentSales.toFixed(2)),
        percentChange: percentChange !== null ? Number(percentChange.toFixed(2)) : null,
        trend,
        comparedTo: `Last ${days} days`,
    };
});
exports.vendorTotalProfitStats = vendorTotalProfitStats;
const vendorOrderCountByStatus = (status_1, ...args_1) => __awaiter(void 0, [status_1, ...args_1], void 0, function* (status, days = 7, vendorId) {
    var _a;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    const matchFilter = {
        createdAt: { $gte: startDate, $lte: today },
        'orderInfo.status': status,
    };
    if (vendorId) {
        const vendorObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
        matchFilter['orderInfo.vendorId'] = vendorObjectId;
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        { $match: matchFilter },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
            },
        },
    ]);
    const totalOrders = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalOrders) || 0;
    return {
        status,
        totalOrders,
        comparedTo: `Last ${days} days`,
    };
});
exports.vendorOrderCountByStatus = vendorOrderCountByStatus;
const vendorTotalShopsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7, vendorId) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (days - 1));
    const matchCondition = {
        createdAt: { $gte: startDate, $lte: today },
    };
    if (vendorId) {
        matchCondition.vendorId = vendorId;
    }
    const totalShops = yield shop_model_1.ShopModel.countDocuments(matchCondition);
    return {
        totalShops,
        comparedTo: `Last ${days} days`
    };
});
exports.vendorTotalShopsStats = vendorTotalShopsStats;
const vendorTrendingProductsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7, vendorId) {
    const today = new Date();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(today.getDate() - (days - 1));
    const matchStage = {
        createdAt: { $gte: startDate, $lte: today },
    };
    const pipeline = [
        { $match: matchStage },
        { $unwind: '$orderInfo' },
        {
            $match: Object.assign({ 'orderInfo.isCancelled': { $ne: true } }, (vendorId && {
                'orderInfo.vendorId': new mongoose_1.default.Types.ObjectId(vendorId),
            })),
        },
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
    ];
    const result = yield order_model_1.OrderModel.aggregate(pipeline);
    return {
        comparedTo: `Last ${days} days`,
        trendingProducts: result,
    };
});
exports.vendorTrendingProductsStats = vendorTrendingProductsStats;
const VendorTopSellingProducts = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const days = 365;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const matchStage = {
        createdAt: { $gte: startDate, $lte: endDate },
        'orderInfo.isCancelled': { $ne: true },
    };
    if (vendorId) {
        matchStage['orderInfo.vendorId'] = new mongoose_1.default.Types.ObjectId(vendorId);
    }
    const topSellingProducts = yield order_model_1.OrderModel.aggregate([
        { $match: matchStage },
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
                as: 'productDetails',
            },
        },
        { $unwind: '$productDetails' },
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
                totalSold: 1,
                totalRevenue: 1,
            },
        },
    ]);
    return topSellingProducts;
});
exports.VendorTopSellingProducts = VendorTopSellingProducts;
const vendorTodayOrdersStats = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const matchStage = {
        createdAt: { $gte: today, $lt: tomorrow },
    };
    const unwindAndMatchStage = Object.assign({ 'orderInfo.isCancelled': { $ne: true } }, (vendorId && {
        'orderInfo.vendorId': new mongoose_1.default.Types.ObjectId(vendorId),
    }));
    const todayOrders = yield order_model_1.OrderModel.aggregate([
        { $match: matchStage },
        { $unwind: '$orderInfo' },
        { $match: unwindAndMatchStage },
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
        { $unwind: '$orderInfo' },
        {
            $match: Object.assign({ 'orderInfo.isCancelled': { $ne: true } }, (vendorId && {
                'orderInfo.vendorId': new mongoose_1.default.Types.ObjectId(vendorId),
            })),
        },
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
        vendorId: vendorId || null,
        todayCount,
        percentChange: Number(percentChange.toFixed(1)),
        todayHourlyData,
    };
});
exports.vendorTodayOrdersStats = vendorTodayOrdersStats;
const vendorRecentOrders = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const matchStage = {};
    if (vendorId) {
        matchStage['orderInfo.vendorId'] = new mongoose_1.default.Types.ObjectId(vendorId);
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        { $match: Object.assign({ 'orderInfo.isCancelled': { $ne: true } }, matchStage) },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                customerInfo: 1,
                orderInfo: 1,
                totalAmount: 1,
                orderNote: 1,
            },
        },
    ]);
    return result;
});
exports.vendorRecentOrders = vendorRecentOrders;
const vendorMonthlySalesHistory = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const matchStage = { 'orderInfo.isCancelled': { $ne: true } };
    if (vendorId) {
        matchStage['orderInfo.vendorId'] = new mongoose_1.default.Types.ObjectId(vendorId);
    }
    const result = yield order_model_1.OrderModel.aggregate([
        { $unwind: '$orderInfo' },
        { $match: matchStage },
        {
            $addFields: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' },
            },
        },
        {
            $group: {
                _id: { month: '$month', year: '$year' },
                totalSales: { $sum: '$orderInfo.totalAmount.total' },
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
            $sort: { year: -1, monthName: 1 },
        },
    ]);
    return {
        vendorId: vendorId || null,
        monthlySales: result,
    };
});
exports.vendorMonthlySalesHistory = vendorMonthlySalesHistory;
