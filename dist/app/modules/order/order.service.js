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
exports.orderServices = exports.updateOrderStatusInDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const nanoid_1 = require("nanoid");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const product_model_1 = require("../product/product.model");
const user_model_1 = require("../user/user.model");
const order_consts_1 = require("./order.consts");
const order_model_1 = require("./order.model");
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
        select: "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
    },
    {
        path: "orderInfo.products.product", // ✅ populate all products in products[]
        select: "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
    },
];
/**
 * ✅ Get All Orders
 */
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.OrderModel.find().populate(orderPopulateOptions), query)
        .search(order_consts_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    return result;
});
/**
 * ✅ Get My Orders (for logged-in user)
 */
const getMyOrdersFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.OrderModel.find({ "orderInfo.orderBy": userId }).populate(orderPopulateOptions), query)
        .search(order_consts_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    return result;
});
/**
 * ✅ Get Single Order by ID
 */
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.findById(id).populate(orderPopulateOptions);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order does not exist!");
    }
    return result;
});
// 🔹 Get Commission Summary for a User
const getUserCommissionSummaryFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // populate both legacy single product and new products array
    const orders = yield order_model_1.OrderModel.find({
        "orderInfo.orderBy": userId,
    }).populate([
        {
            path: "orderInfo.productInfo",
            select: "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
        },
        {
            path: "orderInfo.products.product",
            select: "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
        },
    ]);
    if (!orders || orders.length === 0) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "No orders found for this user");
    }
    let totalOrders = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let totalPercentageCommissionAmount = 0;
    let totalFixedCommissionAmount = 0;
    let totalPercentageRate = 0;
    let percentageCommissionCount = 0;
    let totalSaleAmount = 0;
    let totalRetailAmount = 0;
    let totalWholesaleAmount = 0;
    // Helper to extract numeric fields robustly
    const getSalePriceFromProduct = (prod) => {
        var _a, _b;
        // prefer salePrice if > 0, otherwise use price
        const sale = (_a = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _a === void 0 ? void 0 : _a.salePrice;
        const price = (_b = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _b === void 0 ? void 0 : _b.price;
        if (typeof sale === "number" && sale > 0)
            return sale;
        if (typeof price === "number")
            return price;
        return 0;
    };
    const getRetailPriceFromProduct = (prod) => {
        var _a;
        const retail = (_a = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _a === void 0 ? void 0 : _a.retailPrice;
        if (typeof retail === "number" && retail > 0)
            return retail;
        return 0;
    };
    const getWholesalePriceFromProduct = (prod) => {
        var _a, _b;
        // support both spellings
        const w1 = (_a = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _a === void 0 ? void 0 : _a.wholeSalePrice;
        const w2 = (_b = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _b === void 0 ? void 0 : _b.wholesalePrice;
        if (typeof w1 === "number" && w1 > 0)
            return w1;
        if (typeof w2 === "number" && w2 > 0)
            return w2;
        return 0;
    };
    for (const order of orders) {
        for (const info of order.orderInfo) {
            // count only entries that belong to this user
            if (((_a = info.orderBy) === null || _a === void 0 ? void 0 : _a.toString()) !== userId)
                continue;
            totalOrders++;
            if (info.status === "paid") {
                completedOrders++;
                // 1) single-product legacy field `productInfo`
                // if (info.productInfo) {
                //   const prod = info.productInfo as any;
                //   const qty = info.quantity || 1;
                //   const salePrice = getSalePriceFromProduct(prod);
                //   const retailPrice = getRetailPriceFromProduct(prod);
                //   const wholesalePrice = getWholesalePriceFromProduct(prod);
                //   totalSaleAmount += salePrice * qty;
                //   totalRetailAmount += retailPrice * qty;
                //   totalWholesaleAmount += wholesalePrice * qty;
                // }
                if (info.productInfo) {
                    const prod = info.productInfo;
                    const qty = info.totalQuantity || info.quantity || 1; // ✅ FIXED
                    const salePrice = getSalePriceFromProduct(prod);
                    const retailPrice = getRetailPriceFromProduct(prod);
                    const wholesalePrice = getWholesalePriceFromProduct(prod);
                    totalSaleAmount += salePrice * qty;
                    totalRetailAmount += retailPrice * qty;
                    totalWholesaleAmount += wholesalePrice * qty;
                }
                // 2) new multi-product array `products`
                if (Array.isArray(info.products) && info.products.length > 0) {
                    for (const p of info.products) {
                        const prod = p.product;
                        const qty = p.quantity || 1;
                        // if price was stored on the ordered item (p.price), that should be used if you want exact order price;
                        // otherwise use product document values
                        const usedSalePrice = typeof p.price === "number" && p.price > 0
                            ? p.price
                            : getSalePriceFromProduct(prod);
                        const retailPrice = typeof p.retailPrice === "number" &&
                            p.retailPrice > 0
                            ? p.retailPrice
                            : getRetailPriceFromProduct(prod);
                        const wholesalePrice = typeof p.wholesalePrice === "number" &&
                            p.wholesalePrice > 0
                            ? p.wholesalePrice
                            : getWholesalePriceFromProduct(prod);
                        totalSaleAmount += usedSalePrice * qty;
                        totalRetailAmount += retailPrice * qty;
                        totalWholesaleAmount += wholesalePrice * qty;
                    }
                }
                // commission aggregation (commission belongs to the orderInfo item)
                if (((_b = info.commission) === null || _b === void 0 ? void 0 : _b.type) === "percentage") {
                    totalPercentageCommissionAmount += info.commission.amount || 0;
                    totalPercentageRate += info.commission.value || 0;
                    percentageCommissionCount++;
                }
                else if (((_c = info.commission) === null || _c === void 0 ? void 0 : _c.type) === "fixed") {
                    totalFixedCommissionAmount += info.commission.amount || 0;
                }
            }
            else if (info.status === "pending") {
                pendingOrders++;
            }
        }
    }
    const averagePercentageRate = percentageCommissionCount > 0
        ? totalPercentageRate / percentageCommissionCount
        : 0;
    const totalCommission = totalPercentageCommissionAmount + totalFixedCommissionAmount;
    return {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalCommission,
        totalPercentageCommissionAmount,
        totalFixedCommissionAmount,
        averagePercentageRate,
        totalSaleAmount,
        totalRetailAmount,
        totalWholesaleAmount,
    };
});
/**
 * ✅ Get Overall Order Summary
 */
const getOrderSummaryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const summary = yield order_model_1.OrderModel.aggregate([
        { $unwind: "$orderInfo" }, // flatten each order item
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
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
                totalOrderSaleAmount: { $sum: "$totalAmount" },
                totalPendingSale: {
                    $sum: {
                        $cond: [
                            { $eq: ["$orderInfo.status", "pending"] },
                            "$orderInfo.totalAmount.total",
                            0,
                        ],
                    },
                },
                totalPaidOrderSaleAmount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$orderInfo.status", "paid"] },
                            "$orderInfo.totalAmount.total",
                            0,
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalOrders: 1,
                pendingOrders: 1,
                paidOrders: 1,
                customerOrders: 1,
                srOrders: 1,
                totalOrderSaleAmount: 1,
                totalPendingSale: 1,
                totalPaidOrderSaleAmount: 1,
            },
        },
    ]);
    return (summary[0] || {
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        customerOrders: 0,
        srOrders: 0,
        totalOrderSaleAmount: 0,
        totalPendingSale: 0,
        totalPaidOrderSaleAmount: 0,
    });
});
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
const createOrderIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        let totalQuantity = 0;
        payload.orderInfo.forEach((order) => {
            // 🔹 Generate tracking number
            order.trackingNumber = (0, nanoid_1.nanoid)();
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
                }
                else if (order.commission.type === "fixed") {
                    order.commission.amount = order.commission.value;
                }
            }
        });
        // 🔹 Assign totalQuantity to main order payload
        payload.totalQuantity = totalQuantity;
    }
    // 🔹 Create order in DB
    const result = yield order_model_1.OrderModel.create(payload);
    return result;
});
const updateOrderInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order does not exists!");
    }
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
//  Update Order Status (Dedicated Route)
// const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
//   const order = await OrderModel.findById(id);
//   if (!order) {
//     throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
//   }
//   // Update the status for the first orderInfo item
//   if (order.orderInfo && order.orderInfo.length > 0) {
//     order.orderInfo[0].status = status;
//   } else {
//     throw new AppError(httpStatus.BAD_REQUEST, "Order info is missing!");
//   }
//   await order.save();
//   return order;
// };
// const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
//   const order = await OrderModel.findById(id).populate("orderInfo.productInfo");
//   if (!order) {
//     throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
//   }
//   if (!order.orderInfo || order.orderInfo.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Order info is missing!");
//   }
//   // ✅ Update status for all products in the order
//   order.orderInfo.forEach((item) => {
//     item.status = status;
//   });
//   // ✅ Apply commission when status changes to "paid"
//   if (status === "paid") {
//     for (const item of order.orderInfo) {
//       const product = item.productInfo as any;
//       if (product && item.commission && !item.commission.amount) {
//         // Example: calculate commission only if not already set
//         const commissionRate =
//           item.commission.type === "percentage"
//             ? item.commission.value / 100
//             : 0;
//         const commissionAmount =
//           item.commission.type === "percentage"
//             ? item.totalAmount.subTotal * commissionRate
//             : item.commission.value;
//         item.commission.amount = commissionAmount;
//       }
//     }
//   }
//   await order.save();
//   return order;
// };
// 🧩 UPDATE ORDER STATUS
// const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
//   const order = await OrderModel.findById(id).populate("orderInfo.productInfo");
//   if (!order) {
//     throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
//   }
//   if (!order.orderInfo || order.orderInfo.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Order info is missing!");
//   }
//   // ✅ Update status for all products in the order
//   order.orderInfo.forEach((item) => {
//     item.status = status;
//   });
//   // ✅ When status becomes "paid"
//   if (status === "paid") {
//     for (const item of order.orderInfo) {
//       const product = item.productInfo as any;
//       if (product) {
//         // 🟢 Reduce product stock
//         if (product.quantity < item.quantity) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `Not enough stock for "${product.name}".`
//           );
//         }
//         product.quantity -= item.quantity;
//         await ProductModel.findByIdAndUpdate(product._id, {
//           quantity: product.quantity,
//         });
//         // 🧮 Apply commission if not already applied
//         if (item.commission && !item.commission.amount) {
//           const commissionRate =
//             item.commission.type === "percentage"
//               ? item.commission.value / 100
//               : 0;
//           const commissionAmount =
//             item.commission.type === "percentage"
//               ? item.totalAmount.subTotal * commissionRate
//               : item.commission.value;
//           item.commission.amount = commissionAmount;
//         }
//         // 💰 Update SR (user with role 'sr') commission balance
//         if (item.userRole && item.commission?.amount) {
//           const srUser = await UserModel.findById(item.userRole);
//           if (srUser && srUser.role === "sr") {
//             await UserModel.findByIdAndUpdate(
//               srUser._id,
//               {
//                 $inc: { commissionBalance: item.commission.amount },
//               },
//               { new: true }
//             );
//           }
//         }
//       }
//     }
//   }
//   await order.save();
//   return order;
// };
// const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
//   const order = await OrderModel.findById(id).populate("orderInfo.productInfo");
//   if (!order) {
//     throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
//   }
//   if (!order.orderInfo || order.orderInfo.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Order info is missing!");
//   }
//   // ✅ Update status for all products in the order
//   order.orderInfo.forEach((item) => {
//     item.status = status;
//   });
//   // ✅ When status becomes "paid"
//   if (status === "paid") {
//     for (const item of order.orderInfo) {
//       const product = item.productInfo as any;
//       if (product) {
//         // 🟢 Reduce product stock
//         if (product.quantity < item.quantity) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `Not enough stock for "${product.name}".`
//           );
//         }
//         product.quantity -= item.quantity;
//         await ProductModel.findByIdAndUpdate(product._id, {
//           quantity: product.quantity,
//         });
//         // 🧮 Apply commission if not already applied
//         if (item.commission && !item.commission.amount) {
//           const commissionRate =
//             item.commission.type === "percentage"
//               ? item.commission.value / 100
//               : 0;
//           const commissionAmount =
//             item.commission.type === "percentage"
//               ? item.totalAmount.subTotal * commissionRate
//               : item.commission.value;
//           item.commission.amount = commissionAmount;
//         }
//         // 💰 Update SR (user with role 'sr') commission balance
//         if (item.user && item.commission?.amount) {
//           const srUser = await UserModel.findById(item.user);
//           if (srUser && srUser.role === "sr") {
//             await UserModel.findByIdAndUpdate(
//               srUser._id,
//               {
//                 $inc: { commissionBalance: item.commission.amount },
//               },
//               { new: true }
//             );
//           }
//         }
//       }
//     }
//   }
//   await order.save();
//   return order;
// };
const updateOrderStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const order = yield order_model_1.OrderModel.findById(id).populate("orderInfo.productInfo");
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order not found!");
    }
    if (!order.orderInfo || order.orderInfo.length === 0) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Order info is missing!");
    }
    // ✅ Update status for all products in the order
    order.orderInfo.forEach((item) => {
        item.status = status;
    });
    // ✅ When status becomes "paid"
    if (status === "paid") {
        for (const item of order.orderInfo) {
            const product = item.productInfo;
            if (product) {
                // 🟢 Reduce product stock
                if (product.quantity < item.quantity) {
                    throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for "${((_a = product.description) === null || _a === void 0 ? void 0 : _a.name) || product.name}".`);
                }
                product.quantity -= item.quantity;
                yield product_model_1.ProductModel.findByIdAndUpdate(product._id, {
                    quantity: product.quantity,
                });
                // 🧮 Apply commission if not already applied
                if (!item.commission.amount && item.commission.value) {
                    const commissionRate = item.commission.type === "percentage"
                        ? item.commission.value / 100
                        : 0;
                    const commissionAmount = item.commission.type === "percentage"
                        ? item.totalAmount.subTotal * commissionRate
                        : item.commission.value;
                    item.commission.amount = commissionAmount;
                }
                // 💰 Update SR (user with role 'sr') commission balance only once
                if (((_b = item.orderBy) === null || _b === void 0 ? void 0 : _b._id) &&
                    item.userRole === "sr" &&
                    ((_c = item.commission) === null || _c === void 0 ? void 0 : _c.amount) &&
                    !item.commission.isAddedToBalance // ✅ FIX: prevent double addition
                ) {
                    const userId = item.orderBy._id;
                    // ✅ Ensure user exists and `commissionBalance` defaults to 0 if missing
                    yield user_model_1.UserModel.findByIdAndUpdate(userId, {
                        $inc: { commissionBalance: item.commission.amount || 0 },
                    }, { new: true, upsert: false });
                    // Mark that this commission has been added
                    item.commission.isAddedToBalance = true;
                }
            }
        }
    }
    yield order.save();
    return order;
});
exports.updateOrderStatusInDB = updateOrderStatusInDB;
exports.orderServices = {
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    getUserCommissionSummaryFromDB,
    createOrderIntoDB,
    updateOrderStatusInDB,
    getOrderSummaryFromDB,
    updateOrderInDB,
    getMyOrdersFromDB,
};
