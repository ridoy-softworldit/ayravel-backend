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
exports.orderServices = void 0;
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
    let totalQuantity = 0; // ✅ Added this
    let totalPercentageCommissionAmount = 0;
    let totalFixedCommissionAmount = 0;
    let totalPercentageRate = 0;
    let percentageCommissionCount = 0;
    let totalSaleAmount = 0;
    let totalRetailAmount = 0;
    let totalWholesaleAmount = 0;
    // Helpers
    const getSalePriceFromProduct = (prod) => {
        var _a, _b;
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
        return typeof retail === "number" && retail > 0 ? retail : 0;
    };
    const getWholesalePriceFromProduct = (prod) => {
        var _a, _b;
        const w1 = (_a = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _a === void 0 ? void 0 : _a.wholeSalePrice;
        const w2 = (_b = prod === null || prod === void 0 ? void 0 : prod.productInfo) === null || _b === void 0 ? void 0 : _b.wholesalePrice;
        if (typeof w1 === "number" && w1 > 0)
            return w1;
        if (typeof w2 === "number" && w2 > 0)
            return w2;
        return 0;
    };
    // ===== Loop through all orders =====
    for (const order of orders) {
        for (const info of order.orderInfo) {
            if (((_a = info.orderBy) === null || _a === void 0 ? void 0 : _a.toString()) !== userId)
                continue;
            totalOrders++;
            if (info.status === "paid") {
                completedOrders++;
                // ✅ Use totalQuantity everywhere for accurate totals
                const qty = info.totalQuantity || info.quantity || 1;
                totalQuantity += qty;
                // Handle single product orderInfo.productInfo
                if (info.productInfo) {
                    const prod = info.productInfo;
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
                        const prod = p.product;
                        const pq = p.quantity || 1;
                        totalQuantity += pq; // ✅ Add each sub-product quantity
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
                        totalSaleAmount += usedSalePrice * pq;
                        totalRetailAmount += retailPrice * pq;
                        totalWholesaleAmount += wholesalePrice * pq;
                    }
                }
                // ✅ Commission calculation (use totalQuantity multiplier if needed)
                if (((_b = info.commission) === null || _b === void 0 ? void 0 : _b.type) === "percentage") {
                    const commissionAmount = info.commission.amount || 0;
                    totalPercentageCommissionAmount += commissionAmount;
                    totalPercentageRate += info.commission.value || 0;
                    percentageCommissionCount++;
                }
                else if (((_c = info.commission) === null || _c === void 0 ? void 0 : _c.type) === "fixed") {
                    const commissionAmount = info.commission.amount || 0;
                    totalFixedCommissionAmount += commissionAmount;
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
        totalQuantity, // ✅ Added output field
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
const getOrderSummaryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Step 1: Calculate all orderInfo-level data (status, userRole, etc.)
    const summary = yield order_model_1.OrderModel.aggregate([
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
    const rootTotal = yield order_model_1.OrderModel.aggregate([
        {
            $group: {
                _id: null,
                totalOrderSaleAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
            },
        },
    ]);
    // Return constructed summary using safe optional chaining and defaults
    return {
        totalOrders: ((_a = summary[0]) === null || _a === void 0 ? void 0 : _a.totalOrdersCount) || 0,
        pendingOrders: ((_b = summary[0]) === null || _b === void 0 ? void 0 : _b.pendingOrders) || 0,
        paidOrders: ((_c = summary[0]) === null || _c === void 0 ? void 0 : _c.paidOrders) || 0,
        customerOrders: ((_d = summary[0]) === null || _d === void 0 ? void 0 : _d.customerOrders) || 0,
        srOrders: ((_e = summary[0]) === null || _e === void 0 ? void 0 : _e.srOrders) || 0,
        totalOrderSaleAmount: ((_f = rootTotal[0]) === null || _f === void 0 ? void 0 : _f.totalOrderSaleAmount) || 0,
        totalPendingSale: ((_g = summary[0]) === null || _g === void 0 ? void 0 : _g.totalPendingSale) || 0,
        totalPaidOrderSaleAmount: ((_h = summary[0]) === null || _h === void 0 ? void 0 : _h.totalPaidOrderSaleAmount) || 0,
    };
});
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
const updateOrderStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const order = yield order_model_1.OrderModel.findById(id).populate("orderInfo.productInfo");
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Order not found!");
    }
    if (!order.orderInfo || order.orderInfo.length === 0) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Order info is missing!");
    }
    // ✅ Update all items’ status
    order.orderInfo.forEach((item) => {
        item.status = status;
    });
    // ✅ When order is marked as PAID
    if (status === "paid") {
        for (const item of order.orderInfo) {
            const product = item.productInfo;
            if (product) {
                // 🧩 Determine which quantity field to use
                const orderQty = item.totalQuantity && item.totalQuantity > 0
                    ? item.totalQuantity
                    : item.quantity || 0;
                if (orderQty <= 0) {
                    throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid order quantity for "${((_a = product.description) === null || _a === void 0 ? void 0 : _a.name) || product.name}".`);
                }
                // 🟢 Check and reduce product stock
                if (product.quantity < orderQty) {
                    throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for "${((_b = product.description) === null || _b === void 0 ? void 0 : _b.name) || product.name}". Only ${product.quantity} left.`);
                }
                // ✅ Deduct the quantity from product stock
                product.quantity -= orderQty;
                yield product_model_1.ProductModel.findByIdAndUpdate(product._id, {
                    quantity: product.quantity,
                });
                // 🧮 Apply commission (only once)
                if (!item.commission.amount && item.commission.value) {
                    const commissionRate = item.commission.type === "percentage"
                        ? item.commission.value / 100
                        : 0;
                    const commissionAmount = item.commission.type === "percentage"
                        ? item.totalAmount.subTotal * commissionRate
                        : item.commission.value;
                    item.commission.amount = commissionAmount;
                }
                // 💰 Update SR’s commission balance once per paid order item
                if (((_c = item.orderBy) === null || _c === void 0 ? void 0 : _c._id) &&
                    item.userRole === "sr" &&
                    ((_d = item.commission) === null || _d === void 0 ? void 0 : _d.amount) &&
                    !item.commission.isAddedToBalance) {
                    yield user_model_1.UserModel.findByIdAndUpdate(item.orderBy._id, { $inc: { commissionBalance: item.commission.amount || 0 } }, { new: true });
                    item.commission.isAddedToBalance = true;
                }
            }
        }
    }
    yield order.save();
    return order;
});
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
