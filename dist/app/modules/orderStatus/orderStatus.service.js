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
exports.orderStatusServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const orderStatus_model_1 = require("./orderStatus.model");
const orderStatus_const_1 = require("./orderStatus.const");
const getAllOrderStatusFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderStatusQuery = new QueryBuilder_1.default(orderStatus_model_1.OrderStatus.find(), query)
        .search(orderStatus_const_1.OrderStatusSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderStatusQuery.modelQuery;
    return result;
});
const getSingleOrderStatusFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_model_1.OrderStatus.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "OrderStatus does not exist!");
    }
    return result;
});
const createOrderStatusIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_model_1.OrderStatus.create(payload);
    return result;
});
const updateOrderStatusInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_model_1.OrderStatus.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "OrderStatus does not exist!");
    }
    return result;
});
// 🔹 Delete OrderStatus
const deleteOrderStatusFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderStatus_model_1.OrderStatus.findByIdAndDelete(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "OrderStatus does not exist!");
    }
    return result;
});
exports.orderStatusServices = {
    getAllOrderStatusFromDB,
    getSingleOrderStatusFromDB,
    createOrderStatusIntoDB,
    updateOrderStatusInDB,
    deleteOrderStatusFromDB,
};
