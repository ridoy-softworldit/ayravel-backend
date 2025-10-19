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
exports.salesHistoryServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const salesHistory_model_1 = require("./salesHistory.model");
const getAllSalesHistoryFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const historyQuery = new QueryBuilder_1.default(salesHistory_model_1.SalesHistoryModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield historyQuery.modelQuery;
    return result;
});
const getSingleSalesHistoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield salesHistory_model_1.SalesHistoryModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Sales history not found!");
    }
    return result;
});
const createSalesHistoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield salesHistory_model_1.SalesHistoryModel.create(payload);
    return result;
});
exports.salesHistoryServices = {
    getAllSalesHistoryFromDB,
    getSingleSalesHistoryFromDB,
    createSalesHistoryIntoDB,
};
