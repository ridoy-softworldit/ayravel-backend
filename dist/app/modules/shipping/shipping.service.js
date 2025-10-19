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
exports.shippingServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const shipping_model_1 = require("./shipping.model");
const createShippingOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_model_1.ShippingModel.create(payload);
    return result;
});
const getAllShippingFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const shippingQuery = new QueryBuilder_1.default(shipping_model_1.ShippingModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield shippingQuery.modelQuery;
    return result;
});
const getSingleShippingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_model_1.ShippingModel.findById(id);
    return result;
});
exports.shippingServices = {
    createShippingOnDB,
    getAllShippingFromDB,
    getSingleShippingFromDB,
};
