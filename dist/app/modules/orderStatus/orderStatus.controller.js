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
exports.orderStatusControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const orderStatus_service_1 = require("./orderStatus.service");
// 🔹 Get all OrderStatus
const getAllOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_service_1.orderStatusServices.getAllOrderStatusFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order statuses retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get single OrderStatus
const getSingleOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield orderStatus_service_1.orderStatusServices.getSingleOrderStatusFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status retrieved successfully!",
        data: result,
    });
}));
// 🔹 Create OrderStatus
const createOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderStatusData = req.body;
    const result = yield orderStatus_service_1.orderStatusServices.createOrderStatusIntoDB(orderStatusData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status created successfully!",
        data: result,
    });
}));
// 🔹 Update OrderStatus
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const orderStatusData = req.body;
    const result = yield orderStatus_service_1.orderStatusServices.updateOrderStatusInDB(id, orderStatusData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status updated successfully!",
        data: result,
    });
}));
// 🔹 Delete OrderStatus
const deleteOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield orderStatus_service_1.orderStatusServices.deleteOrderStatusFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status deleted successfully!",
        data: result,
    });
}));
exports.orderStatusControllers = {
    getAllOrderStatus,
    getSingleOrderStatus,
    createOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
};
