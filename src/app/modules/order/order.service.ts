import httpStatus from "http-status";
import { nanoid } from "nanoid";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";
import { OrderSearchableFields } from "./order.consts";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";

type OrderStatus =
  | "pending"
  | "processing"
  | "at-local-facility"
  | "delivered"
  | "cancelled"
  | "paid";

/**
 * ✅ Helper: Common populate configuration for all order queries
 */
const orderPopulateOptions = [
  {
    path: "orderInfo.orderBy",
    select: "name email",
  },
  {
    path: "orderInfo.productInfo",
    select:
      "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
  },
  {
    path: "orderInfo.products.product", // ✅ populate all products in products[]
    select:
      "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
  },
];

/**
 * ✅ Get All Orders
 */
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find().populate(orderPopulateOptions),
    query
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  return result;
};

/**
 * ✅ Get My Orders (for logged-in user)
 */
const getMyOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find({ "orderInfo.orderBy": userId }).populate(
      orderPopulateOptions
    ),
    query
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  return result;
};

/**
 * ✅ Get Single Order by ID
 */
const getSingleOrderFromDB = async (id: string) => {
  const result = await OrderModel.findById(id).populate(orderPopulateOptions);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exist!");
  }

  return result;
};

// 🔹 Get Commission Summary for a User

const getUserCommissionSummaryFromDB = async (userId: string) => {
  const orders = await OrderModel.find({
    "orderInfo.orderBy": userId,
  }).populate([
    {
      path: "orderInfo.productInfo",
      select:
        "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
    },
    {
      path: "orderInfo.products.product",
      select:
        "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
    },
  ]);

  if (!orders || orders.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }

  let totalOrders = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let totalQuantity = 0; // ✅ Added this

  let totalPercentageCommissionAmount = 0;
  let totalFixedCommissionAmount = 0;
  let totalPercentageRate = 0;
  let percentageCommissionCount = 0;

  let totalSaleAmount = 0;
  let totalRetailAmount = 0;
  let totalWholesaleAmount = 0;

  // Helpers
  const getSalePriceFromProduct = (prod: any) => {
    const sale = prod?.productInfo?.salePrice;
    const price = prod?.productInfo?.price;
    if (typeof sale === "number" && sale > 0) return sale;
    if (typeof price === "number") return price;
    return 0;
  };

  const getRetailPriceFromProduct = (prod: any) => {
    const retail = prod?.productInfo?.retailPrice;
    return typeof retail === "number" && retail > 0 ? retail : 0;
  };

  const getWholesalePriceFromProduct = (prod: any) => {
    const w1 = prod?.productInfo?.wholeSalePrice;
    const w2 = prod?.productInfo?.wholesalePrice;
    if (typeof w1 === "number" && w1 > 0) return w1;
    if (typeof w2 === "number" && w2 > 0) return w2;
    return 0;
  };

  // ===== Loop through all orders =====
  for (const order of orders) {
    for (const info of order.orderInfo) {
      if (info.orderBy?.toString() !== userId) continue;

      totalOrders++;

      if (info.status === "paid") {
        completedOrders++;

        // ✅ Use totalQuantity everywhere for accurate totals
        const qty = info.totalQuantity || info.quantity || 1;
        totalQuantity += qty;

        // Handle single product orderInfo.productInfo
        if (info.productInfo) {
          const prod = info.productInfo as any;

          const salePrice = getSalePriceFromProduct(prod);
          const retailPrice = getRetailPriceFromProduct(prod);
          const wholesalePrice = getWholesalePriceFromProduct(prod);

          totalSaleAmount += salePrice * qty;
          totalRetailAmount += retailPrice * qty;
          totalWholesaleAmount += wholesalePrice * qty;
        }

        // Handle multi-product orders
        if (Array.isArray(info.products) && info.products.length > 0) {
          for (const p of info.products) {
            const prod = (p as any).product as any;
            const pq = (p as any).quantity || 1;
            totalQuantity += pq; // ✅ Add each sub-product quantity

            const usedSalePrice =
              typeof (p as any).price === "number" && (p as any).price > 0
                ? (p as any).price
                : getSalePriceFromProduct(prod);

            const retailPrice =
              typeof (p as any).retailPrice === "number" &&
              (p as any).retailPrice > 0
                ? (p as any).retailPrice
                : getRetailPriceFromProduct(prod);

            const wholesalePrice =
              typeof (p as any).wholesalePrice === "number" &&
              (p as any).wholesalePrice > 0
                ? (p as any).wholesalePrice
                : getWholesalePriceFromProduct(prod);

            totalSaleAmount += usedSalePrice * pq;
            totalRetailAmount += retailPrice * pq;
            totalWholesaleAmount += wholesalePrice * pq;
          }
        }

        // ✅ Commission calculation (use totalQuantity multiplier if needed)
        if (info.commission?.type === "percentage") {
          const commissionAmount = info.commission.amount || 0;
          totalPercentageCommissionAmount += commissionAmount;
          totalPercentageRate += info.commission.value || 0;
          percentageCommissionCount++;
        } else if (info.commission?.type === "fixed") {
          const commissionAmount = info.commission.amount || 0;
          totalFixedCommissionAmount += commissionAmount;
        }
      } else if (info.status === "pending") {
        pendingOrders++;
      }
    }
  }

  const averagePercentageRate =
    percentageCommissionCount > 0
      ? totalPercentageRate / percentageCommissionCount
      : 0;

  const totalCommission =
    totalPercentageCommissionAmount + totalFixedCommissionAmount;

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    totalQuantity, // ✅ Added output field
    totalCommission,
    totalPercentageCommissionAmount,
    totalFixedCommissionAmount,
    averagePercentageRate,
    totalSaleAmount,
    totalRetailAmount,
    totalWholesaleAmount,
  };
};

/**
 * ✅ Get Overall Order Summary
 */
// const getOrderSummaryFromDB = async () => {
//   const summary = await OrderModel.aggregate([
//     { $unwind: "$orderInfo" }, // flatten each order item

//     {
//       $group: {
//         _id: null,

//         totalOrders: { $sum: 1 },
//         pendingOrders: {
//           $sum: {
//             $cond: [{ $eq: ["$orderInfo.status", "pending"] }, 1, 0],
//           },
//         },
//         paidOrders: {
//           $sum: {
//             $cond: [{ $eq: ["$orderInfo.status", "paid"] }, 1, 0],
//           },
//         },
//         customerOrders: {
//           $sum: {
//             $cond: [{ $eq: ["$orderInfo.userRole", "customer"] }, 1, 0],
//           },
//         },
//         srOrders: {
//           $sum: {
//             $cond: [{ $eq: ["$orderInfo.userRole", "sr"] }, 1, 0],
//           },
//         },

//         totalOrderSaleAmount: { $sum: "$totalAmount" },

//         totalPendingSale: {
//           $sum: {
//             $cond: [
//               { $eq: ["$orderInfo.status", "pending"] },
//               "$orderInfo.totalAmount.total",
//               0,
//             ],
//           },
//         },
//         totalPaidOrderSaleAmount: {
//           $sum: {
//             $cond: [
//               { $eq: ["$orderInfo.status", "paid"] },
//               "$orderInfo.totalAmount.total",
//               0,
//             ],
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         totalOrders: 1,
//         pendingOrders: 1,
//         paidOrders: 1,
//         customerOrders: 1,
//         srOrders: 1,
//         totalOrderSaleAmount: 1,
//         totalPendingSale: 1,
//         totalPaidOrderSaleAmount: 1,
//       },
//     },
//   ]);

//   return (
//     summary[0] || {
//       totalOrders: 0,
//       pendingOrders: 0,
//       paidOrders: 0,
//       customerOrders: 0,
//       srOrders: 0,
//       totalOrderSaleAmount: 0,
//       totalPendingSale: 0,
//       totalPaidOrderSaleAmount: 0,
//     }
//   );
// };

// const createOrderIntoDB = async (payload: TOrder) => {
//   if (payload) {
//     payload.orderInfo.forEach((order) => {
//       order.trackingNumber = nanoid();

//       // ✅ Handle user role fallback
//       if (!order.userRole) {
//         order.userRole = "customer"; // Default role if not provided
//       }

//       // Calculate commission if not already included
//       if (order.commission && order.totalAmount) {
//         if (order.commission.type === "percentage") {
//           order.commission.amount =
//             (order.totalAmount.total * order.commission.value) / 100;
//         } else if (order.commission.type === "fixed") {
//           order.commission.amount = order.commission.value;
//         }
//       }
//     });
//   }

//   const result = await OrderModel.create(payload);
//   return result;
// };

// const createOrderIntoDB = async (payload: TOrder) => {
//   if (payload && payload.orderInfo) {
//     for (const orderInfo of payload.orderInfo) {
//       // Generate tracking number
//       orderInfo.trackingNumber = nanoid();

//       // Set default user role
//       if (!orderInfo.userRole) {
//         orderInfo.userRole = "customer";
//       }

//       // ✅ FIX: Ensure products array exists and has data
//       if (!orderInfo.products || orderInfo.products.length === 0) {
//         // If no products in array, create one from the legacy productInfo field
//         if (orderInfo.productInfo) {
//           orderInfo.products = [
//             {
//               product: orderInfo.productInfo,
//               quantity: orderInfo.quantity || 1,
//               price: orderInfo.totalAmount?.subTotal || 0,
//               subtotal: orderInfo.totalAmount?.subTotal || 0,
//               // Add other product fields as needed
//             },
//           ];
//         }
//       }

//       // ✅ FIX: Calculate subtotal for each product in the products array
//       if (orderInfo.products && orderInfo.products.length > 0) {
//         for (const product of orderInfo.products) {
//           // If wholeSalePrice is provided, use it; otherwise use regular price
//           const unitPrice = product.wholeSalePrice || product.price;
//           product.subtotal = unitPrice * product.quantity;
//         }
//       }

//       // Calculate commission
//       if (orderInfo.commission && orderInfo.totalAmount) {
//         if (orderInfo.commission.type === "percentage") {
//           orderInfo.commission.amount =
//             (orderInfo.totalAmount.total * orderInfo.commission.value) / 100;
//         } else if (orderInfo.commission.type === "fixed") {
//           orderInfo.commission.amount = orderInfo.commission.value;
//         }
//       }
//     }
//   }

//   const result = await OrderModel.create(payload);
//   return result;
// };

/**
 * ✅ Get Overall Order Summary (fixed without double-counting)
 */
const getOrderSummaryFromDB = async () => {
  // Step 1: Calculate all orderInfo-level data (status, userRole, etc.)
  const summary = await OrderModel.aggregate([
    { $unwind: "$orderInfo" },
    {
      $group: {
        _id: null,
        totalOrders: { $addToSet: "$_id" }, // to count unique orders later
        pendingOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderInfo.status", "pending"] }, 1, 0],
          },
        },
        paidOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderInfo.status", "paid"] }, 1, 0],
          },
        },
        customerOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderInfo.userRole", "customer"] }, 1, 0],
          },
        },
        srOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderInfo.userRole", "sr"] }, 1, 0],
          },
        },
        // ✅ calculate only paid and pending totals from orderInfo
        totalPendingSale: {
          $sum: {
            $cond: [
              { $eq: ["$orderInfo.status", "pending"] },
              { $ifNull: ["$orderInfo.totalAmount.total", 0] },
              0,
            ],
          },
        },
        totalPaidOrderSaleAmount: {
          $sum: {
            $cond: [
              { $eq: ["$orderInfo.status", "paid"] },
              { $ifNull: ["$orderInfo.totalAmount.total", 0] },
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        totalOrdersCount: { $size: "$totalOrders" },
        pendingOrders: 1,
        paidOrders: 1,
        customerOrders: 1,
        srOrders: 1,
        totalPendingSale: 1,
        totalPaidOrderSaleAmount: 1,
      },
    },
  ]);

  // Step 2: Get the totalOrderSaleAmount separately (root-level total)
  const rootTotal = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalOrderSaleAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
      },
    },
  ]);

  // Return constructed summary using safe optional chaining and defaults
  return {
    totalOrders: summary[0]?.totalOrdersCount || 0,
    pendingOrders: summary[0]?.pendingOrders || 0,
    paidOrders: summary[0]?.paidOrders || 0,
    customerOrders: summary[0]?.customerOrders || 0,
    srOrders: summary[0]?.srOrders || 0,
    totalOrderSaleAmount: rootTotal[0]?.totalOrderSaleAmount || 0,
    totalPendingSale: summary[0]?.totalPendingSale || 0,
    totalPaidOrderSaleAmount: summary[0]?.totalPaidOrderSaleAmount || 0,
  };
};

const createOrderIntoDB = async (payload: TOrder) => {
  if (payload) {
    let totalQuantity = 0;

    payload.orderInfo.forEach((order) => {
      // 🔹 Generate tracking number
      order.trackingNumber = nanoid();

      // 🔹 Fallback user role
      if (!order.userRole) {
        order.userRole = "customer";
      }

      // 🔹 Default selectedPrice (if not provided) — use a numeric default to match the type
      if (order.selectedPrice === undefined || order.selectedPrice === null) {
        order.selectedPrice = 0;
      }

      // 🔹 Sum up quantities for totalQuantity
      if (order.quantity) {
        totalQuantity += order.quantity;
      }

      // 🔹 Calculate commission if applicable
      if (order.commission && order.totalAmount) {
        if (order.commission.type === "percentage") {
          order.commission.amount =
            (order.totalAmount.total * order.commission.value) / 100;
        } else if (order.commission.type === "fixed") {
          order.commission.amount = order.commission.value;
        }
      }
    });

    // 🔹 Assign totalQuantity to main order payload
    payload.totalQuantity = totalQuantity;
  }

  // 🔹 Create order in DB
  const result = await OrderModel.create(payload);
  return result;
};

const updateOrderInDB = async (id: string, payload: Partial<TOrder>) => {
  const isExist = await OrderModel.findById(id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exists!");
  }

  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

//  Update Order Status (Dedicated Route)

const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
  const order = await OrderModel.findById(id).populate("orderInfo.productInfo");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
  }

  if (!order.orderInfo || order.orderInfo.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order info is missing!");
  }

  // ✅ Update all items’ status
  order.orderInfo.forEach((item) => {
    item.status = status;
  });

  // ✅ When order is marked as PAID
  if (status === "paid") {
    for (const item of order.orderInfo) {
      const product = item.productInfo as any;

      if (product) {
        // 🧩 Determine which quantity field to use
        const orderQty =
          item.totalQuantity && item.totalQuantity > 0
            ? item.totalQuantity
            : item.quantity || 0;

        if (orderQty <= 0) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invalid order quantity for "${
              product.description?.name || product.name
            }".`
          );
        }

        // 🟢 Check and reduce product stock
        if (product.quantity < orderQty) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Not enough stock for "${
              product.description?.name || product.name
            }". Only ${product.quantity} left.`
          );
        }

        // ✅ Deduct the quantity from product stock
        product.quantity -= orderQty;

        await ProductModel.findByIdAndUpdate(product._id, {
          quantity: product.quantity,
        });

        // 🧮 Apply commission (only once)
        if (!item.commission.amount && item.commission.value) {
          const commissionRate =
            item.commission.type === "percentage"
              ? item.commission.value / 100
              : 0;

          const commissionAmount =
            item.commission.type === "percentage"
              ? item.totalAmount.subTotal * commissionRate
              : item.commission.value;

          item.commission.amount = commissionAmount;
        }

        // 💰 Update SR’s commission balance once per paid order item
        if (
          item.orderBy?._id &&
          item.userRole === "sr" &&
          item.commission?.amount &&
          !item.commission.isAddedToBalance
        ) {
          await UserModel.findByIdAndUpdate(
            item.orderBy._id,
            { $inc: { commissionBalance: item.commission.amount || 0 } },
            { new: true }
          );

          item.commission.isAddedToBalance = true;
        }
      }
    }
  }

  await order.save();
  return order;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  getUserCommissionSummaryFromDB,
  createOrderIntoDB,
  updateOrderStatusInDB,
  getOrderSummaryFromDB,
  updateOrderInDB,
  getMyOrdersFromDB,
};
