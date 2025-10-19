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
exports.getTotalOrdersStats = exports.getSalesAndCostStats = void 0;
const order_model_1 = require("../order/order.model");
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
const getTotalOrdersStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 7) {
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
                            _id: {
                                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
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
    const currentPeriodTotal = result[0].currentPeriod.reduce((sum, day) => sum + day.count, 0);
    const chartData = [];
    const statsMap = new Map(result[0].currentPeriod.map((s) => [s._id, s.count]));
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i + 1);
        const dateStr = d.toISOString().split('T')[0];
        chartData.push({
            date: dateStr,
            count: statsMap.get(dateStr) || 0,
        });
    }
    return {
        totalOrders: currentPeriodTotal,
        chartData,
    };
});
exports.getTotalOrdersStats = getTotalOrdersStats;
// export const getTotalProfitStats = async (days: number = 7) => {
//   const endDate = new Date();
//   const startDate = new Date();
//   startDate.setDate(endDate.getDate() - days);
//   const previousStartDate = new Date();
//   previousStartDate.setDate(startDate.getDate() - days);
//   // aggregation pipeline function
//   const pipeline = (start: Date, end: Date) => [
//     { $match: { createdAt: { $gte: start, $lte: end } } },
//     { $unwind: '$orderInfo' },
//     // convert productInfo to ObjectId
//     {
//       $addFields: {
//         'orderInfo.productInfo': { $toObjectId: '$orderInfo.productInfo' },
//       },
//     },
//     {
//       $lookup: {
//         from: 'products',
//         localField: 'orderInfo.productInfo',
//         foreignField: '_id',
//         as: 'productDetails',
//       },
//     },
//     { $unwind: '$productDetails' },
//     {
//       $project: {
//         _id: 0,
//         date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//         profit: {
//           $subtract: [
//             '$orderInfo.totalAmount.total', // Sales Price
//             {
//               $multiply: [
//                 '$productDetails.productInfo.price', // Cost price
//                 '$orderInfo.quantity',
//               ],
//             },
//           ],
//         },
//       },
//     },
//   ];
//   const result = await OrderModel.aggregate([
//     {
//       $facet: {
//         currentPeriod: [
//           ...pipeline(startDate, endDate),
//           { $group: { _id: '$date', totalProfit: { $sum: '$profit' } } },
//           { $sort: { _id: 1 } },
//         ],
//         previousPeriod: [
//           ...pipeline(previousStartDate, startDate),
//           { $group: { _id: null, totalProfit: { $sum: '$profit' } } },
//         ],
//       },
//     },
//   ]);
//   const currentPeriodTotal = result[0].currentPeriod.reduce(
//     (sum, day) => sum + day.totalProfit,
//     0
//   );
//   const previousPeriodTotal = result[0].previousPeriod[0]?.totalProfit || 0;
//   let percentageChange = 0;
//   if (previousPeriodTotal > 0) {
//     percentageChange =
//       ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
//   } else if (currentPeriodTotal > 0) {
//     percentageChange = 100;
//   }
//   // chart data
//   const chartData = [];
//   const statsMap = new Map(
//     result[0].currentPeriod.map(s => [s._id, s.totalProfit])
//   );
//   for (let i = 0; i < days; i++) {
//     const d = new Date(startDate);
//     d.setDate(d.getDate() + i + 1);
//     const dateStr = d.toISOString().split('T')[0];
//     chartData.push({
//       date: dateStr,
//       profit: statsMap.get(dateStr) || 0,
//     });
//   }
//   return {
//     totalProfit: currentPeriodTotal,
//     percentageChange: parseFloat(percentageChange.toFixed(2)),
//     chartData,
//   };
// };
