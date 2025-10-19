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
exports.orderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const getAllOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderServices.getAllOrdersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders retrieve successfully!",
        data: result,
    });
}));
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const result = yield order_service_1.orderServices.getMyOrdersFromDB(customerId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders retrieved successfully!",
        data: result,
    });
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield order_service_1.orderServices.getSingleOrderFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order retrieve successfully!",
        data: result,
    });
}));
/**
 * ✅ Get Order Summary Controller
 */
const getOrderSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const summary = yield order_service_1.orderServices.getOrderSummaryFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order summary fetched successfully",
        data: summary,
    });
}));
// ✅ Get Commission Summary Controller
const getUserCommissionSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_service_1.orderServices.getUserCommissionSummaryFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User commission summary retrieved successfully!",
        data: result,
    });
}));
// const createOrder = catchAsync(async (req, res) => {
//   const orderData = req.body;
//   const result = await orderServices.createOrderIntoDB(orderData);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Order created successfully!",
//     data: result,
//   });
// });
// Create Order Controller with Auth Integration
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user || null; // if logged in (from auth middleware)
    const orderData = req.body;
    // Attach logged-in user's ID if available
    if (user) {
        const userId = (_a = user._id) !== null && _a !== void 0 ? _a : user.id;
        orderData.orderInfo = orderData.orderInfo.map((order) => (Object.assign(Object.assign({}, order), { orderBy: userId })));
    }
    const result = yield order_service_1.orderServices.createOrderIntoDB(orderData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: user
            ? "Order created successfully!"
            : "Order created successfully as guest!",
        data: result,
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const result = yield order_service_1.orderServices.updateOrderInDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order updated successfully!",
        data: result,
    });
}));
// Update Order Status Controller
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
        throw new Error("Status field is required");
    }
    const result = yield order_service_1.orderServices.updateOrderStatusInDB(id, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status updated successfully!",
        data: result,
    });
}));
exports.orderControllers = {
    getAllOrder,
    getSingleOrder,
    getUserCommissionSummary,
    createOrder,
    updateOrderStatus,
    updateOrder,
    getOrderSummary,
    getMyOrders,
};
