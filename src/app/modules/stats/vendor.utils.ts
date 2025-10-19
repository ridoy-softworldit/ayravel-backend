import mongoose from 'mongoose';
import { OrderModel } from '../order/order.model';
import { ShopModel } from '../shop/shop.model';

export const vendorSalesAndCostStats = async (
  days: number = 7,
  vendorId?: string
) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(today.getDate() - (days - 1));

  const vendorObjectId = vendorId
    ? new mongoose.Types.ObjectId(vendorId)
    : null;


  const matchFilter: any = {
    createdAt: { $gte: startDate, $lte: today },
  };

  if (vendorObjectId) {
    matchFilter['orderInfo.vendorId'] = vendorObjectId;
  }

  const result = await OrderModel.aggregate([
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


  const allOrders = await OrderModel.aggregate([
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
    if (windowSum > maxSales) maxSales = windowSum;
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
      totalSales: found?.totalSales || 0,
      totalCost: found?.totalCost || 0,
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
};

export const vendorTotalOrdersStats = async (days: number = 7, vendorId?: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const previousStartDate = new Date();
  previousStartDate.setDate(startDate.getDate() - days);

  const matchFilter: any = {
    createdAt: { $gte: startDate, $lte: endDate },
  };
  const prevMatchFilter: any = {
    createdAt: { $gte: previousStartDate, $lte: startDate },
  };

  if (vendorId) {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    matchFilter['orderInfo.vendorId'] = vendorObjectId;
    prevMatchFilter['orderInfo.vendorId'] = vendorObjectId;
  }

  const result = await OrderModel.aggregate([
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

  const currentTotal = result[0]?.currentPeriod[0]?.count || 0;
  const previousTotal = result[0]?.previousPeriod[0]?.count || 0;

  let percentChange = 0;
  if (previousTotal > 0) {
    percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
  } else if (currentTotal > 0) {
    percentChange = 100;
  }

  return {
    totalOrders: currentTotal,
    percentChange: Number(percentChange.toFixed(2)),
    comparedTo: `Last ${days} days`,
  };
};

export const vendorTotalProfitStats = async (days: number = 7, vendorId?: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const previousStartDate = new Date();
  previousStartDate.setDate(startDate.getDate() - days);

  const matchFilter: any = {
    createdAt: { $gte: startDate, $lte: endDate },
  };
  const prevMatchFilter: any = {
    createdAt: { $gte: previousStartDate, $lte: startDate },
  };

  if (vendorId) {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    matchFilter['orderInfo.vendorId'] = vendorObjectId;
    prevMatchFilter['orderInfo.vendorId'] = vendorObjectId;
  }

  const result = await OrderModel.aggregate([
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

  const currentSales = result[0]?.currentPeriod[0]?.totalSales || 0;
  const previousSales = result[0]?.previousPeriod[0]?.totalSales || 0;

  let percentChange: number | null = null;
  let trend: 'up' | 'down' | 'neutral' = 'neutral';

  if (previousSales > 0) {
    percentChange = ((currentSales - previousSales) / previousSales) * 100;
    trend = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
  } else if (currentSales > 0) {
    percentChange = null; 
  }

  return {
    totalSales: Number(currentSales.toFixed(2)),
    percentChange:
      percentChange !== null ? Number(percentChange.toFixed(2)) : null,
    trend,
    comparedTo: `Last ${days} days`,
  };
};

export const vendorOrderCountByStatus = async (
  status: string,
  days: number = 7,
  vendorId?: string
) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const matchFilter: any = {
    createdAt: { $gte: startDate, $lte: today },
    'orderInfo.status': status,
  };

  if (vendorId) {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    matchFilter['orderInfo.vendorId'] = vendorObjectId;
  }

  const result = await OrderModel.aggregate([
    { $unwind: '$orderInfo' },
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const totalOrders = result[0]?.totalOrders || 0;

  return {
    status,
    totalOrders,
    comparedTo: `Last ${days} days`,
  };
};

export const vendorTotalShopsStats = async (
  days: number = 7,
  vendorId: string
) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - (days - 1));

  const matchCondition: any = {
    createdAt: { $gte: startDate, $lte: today },
  };


  if (vendorId) {
    matchCondition.vendorId = vendorId;
  }

  const totalShops = await ShopModel.countDocuments(matchCondition);

  return {
    totalShops,
    comparedTo: `Last ${days} days`
  };
};


export const vendorTrendingProductsStats = async (
  days: number = 7,
  vendorId?: string
) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(today.getDate() - (days - 1));

  const matchStage: any = {
    createdAt: { $gte: startDate, $lte: today },
  };

  const pipeline: any = [
    { $match: matchStage },

    { $unwind: '$orderInfo' },

    {
      $match: {
        'orderInfo.isCancelled': { $ne: true }, 
        ...(vendorId && {
          'orderInfo.vendorId': new mongoose.Types.ObjectId(vendorId),
        }),
      },
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

  const result = await OrderModel.aggregate(pipeline);

  return {
    comparedTo: `Last ${days} days`,
    trendingProducts: result,
  };
};

export const VendorTopSellingProducts = async (
  vendorId?: string
) => {
  const days: number = 365;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const matchStage: any = {
    createdAt: { $gte: startDate, $lte: endDate },
    'orderInfo.isCancelled': { $ne: true }, 
  };

  if (vendorId) {
    matchStage['orderInfo.vendorId'] = new mongoose.Types.ObjectId(vendorId);
  }

  const topSellingProducts = await OrderModel.aggregate([
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
};


export const vendorTodayOrdersStats = async (vendorId?: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);


  const matchStage: any = {
    createdAt: { $gte: today, $lt: tomorrow },
  };

  const unwindAndMatchStage: any = {
    'orderInfo.isCancelled': { $ne: true },
    ...(vendorId && {
      'orderInfo.vendorId': new mongoose.Types.ObjectId(vendorId),
    }),
  };


  const todayOrders = await OrderModel.aggregate([
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


  const yesterdayOrders = await OrderModel.aggregate([
    { $match: { createdAt: { $gte: yesterday, $lt: today } } },
    { $unwind: '$orderInfo' },
    {
      $match: {
        'orderInfo.isCancelled': { $ne: true },
        ...(vendorId && {
          'orderInfo.vendorId': new mongoose.Types.ObjectId(vendorId),
        }),
      },
    },
    { $count: 'count' },
  ]);

  const todayCount = todayOrders.reduce((sum, r) => sum + r.count, 0);
  const yesterdayCount = yesterdayOrders[0]?.count || 0;

  const percentChange =
    yesterdayCount === 0
      ? todayCount > 0
        ? 100
        : 0
      : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

  const formatHourLabel = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
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
};



export const vendorRecentOrders = async (vendorId?: string) => {
  const matchStage: any = {};

  if (vendorId) {
    matchStage['orderInfo.vendorId'] = new mongoose.Types.ObjectId(vendorId);
  }

  const result = await OrderModel.aggregate([
    { $unwind: '$orderInfo' },
    { $match: { 'orderInfo.isCancelled': { $ne: true }, ...matchStage } },
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
};



export const vendorMonthlySalesHistory = async (vendorId?: string) => {
  const matchStage: any = { 'orderInfo.isCancelled': { $ne: true } };

  if (vendorId) {
    matchStage['orderInfo.vendorId'] = new mongoose.Types.ObjectId(vendorId);
  }

  const result = await OrderModel.aggregate([
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
};
