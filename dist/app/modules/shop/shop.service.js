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
exports.shopServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = require("./shop.model");
const shop_const_1 = require("./shop.const");
const user_model_1 = require("../user/user.model");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("../order/order.model");
const getAllShopsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const shopQuery = new QueryBuilder_1.default(shop_model_1.ShopModel.find(), query)
        .search(shop_const_1.ShopSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield shopQuery.modelQuery
        .populate("vendorId")
        .populate("staffs")
        .populate("products")
        .populate("orders")
        .populate("transactions")
        .populate("withdrawals")
        .populate("attributes")
        .populate("coupons");
    return result;
});
const getSingleShopFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_model_1.ShopModel.findById(id)
        .populate("vendorId")
        .populate("staffs")
        .populate("products")
        .populate("orders")
        .populate("transactions")
        .populate("withdrawals")
        .populate("attributes")
        .populate("coupons");
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Shop does not exists!");
    }
    return result;
});
const getShopStatsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalShops = yield shop_model_1.ShopModel.countDocuments();
    const totalProducts = yield product_model_1.ProductModel.countDocuments();
    const totalOrders = yield order_model_1.OrderModel.countDocuments();
    const revenueAgg = yield order_model_1.OrderModel.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);
    const totalRevenue = ((_a = revenueAgg[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
    const shopStatusAgg = yield shop_model_1.ShopModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const statusCounts = {
        active: 0,
        inactive: 0,
        pending: 0,
    };
    shopStatusAgg.forEach((s) => {
        statusCounts[s._id] = s.count;
    });
    return {
        totalShops,
        activeShops: statusCounts.active,
        inactiveShops: statusCounts.inactive,
        pendingShops: statusCounts.pending,
        totalProducts,
        totalOrders,
        totalRevenue,
    };
});
const createShopIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(userId);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exists!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== "admin" && (isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role) !== "vendor") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const isVendorExists = yield user_model_1.UserModel.findById(payload === null || payload === void 0 ? void 0 : payload.vendorId);
    if (!isVendorExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User isn't a valid vendor!");
    }
    if (isUserExists.role === "vendor" &&
        isUserExists._id.toString() !== String(payload.vendorId)) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized vendor access!");
    }
    const result = yield shop_model_1.ShopModel.create(payload);
    return result;
});
const toggleShopActiveStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(payload === null || payload === void 0 ? void 0 : payload.updatedBy);
    if (!isUserExists || isUserExists.role !== "admin") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const isShopExists = yield shop_model_1.ShopModel.findByIdAndUpdate(id, {
        status: payload === null || payload === void 0 ? void 0 : payload.status,
    }, { new: true });
    if (!isShopExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Shop not found!");
    }
    return isShopExists;
});
const updateShopIntoDB = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(userId);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const shop = yield shop_model_1.ShopModel.findById(id);
    if (!shop) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Shop not found!");
    }
    if (isUserExists.role !== "admin" &&
        !(isUserExists.role === "vendor" && shop.vendorId.toString() === userId)) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const updatedShop = yield shop_model_1.ShopModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedShop;
});
const deleteShopFromDB = (ShopId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isShopExists = yield shop_model_1.ShopModel.findById(ShopId);
    if (!isShopExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Shop not found!");
    }
    const isUserExists = yield user_model_1.UserModel.findById(payload === null || payload === void 0 ? void 0 : payload.deletedBy);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "User not found!");
    }
    const isAdmin = isUserExists.role === "admin";
    const isVendor = payload.deletedBy.toString() === isShopExists.vendorId.toString();
    if (!isAdmin && !isVendor) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const result = yield shop_model_1.ShopModel.findByIdAndDelete(ShopId);
    return result;
});
const getMyShopDataFromDB = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get all shops of this vendor
    const shops = yield shop_model_1.ShopModel.find({ vendorId })
        .populate("vendorId")
        .populate("staffs")
        .populate("products")
        .populate("orders")
        .populate("transactions")
        .populate("withdrawals")
        .populate("attributes")
        .populate("coupons");
    if (!shops.length) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "No shops found for this vendor!");
    }
    // Shop IDs
    const shopIds = shops.map((shop) => shop._id);
    // 2. Total product count
    const totalProducts = shops.reduce((acc, shop) => { var _a; return acc + (((_a = shop.products) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
    // 3. Orders that belong to these shops
    const orders = yield order_model_1.OrderModel.find({
        "orderInfo.shopInfo": { $in: shopIds },
    });
    const totalOrders = orders.length;
    // 4. Total revenue (sum of all order.totalAmount)
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    // 5. Unique customers
    const customerSet = new Set();
    orders.forEach((order) => {
        var _a;
        if ((_a = order.customerInfo) === null || _a === void 0 ? void 0 : _a.email) {
            customerSet.add(order.customerInfo.email);
        }
    });
    const totalCustomers = customerSet.size;
    return {
        shops,
        summary: {
            totalShops: shops.length,
            totalProducts,
            totalRevenue,
            totalOrders,
            totalCustomers,
        },
    };
});
exports.shopServices = {
    getAllShopsFromDB,
    getSingleShopFromDB,
    getShopStatsFromDB,
    createShopIntoDB,
    toggleShopActiveStatusIntoDB,
    updateShopIntoDB,
    deleteShopFromDB,
    getMyShopDataFromDB,
};
