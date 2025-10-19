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
exports.transactionServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const transactions_const_1 = require("./transactions.const");
const transactions_model_1 = require("./transactions.model");
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const getAllTransactionsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionQuery = new QueryBuilder_1.default(transactions_model_1.TransactionModel.find(), query)
        .search(transactions_const_1.TransactionsSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield transactionQuery.modelQuery;
    return result;
});
const getSingleTransactionFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transactions_model_1.TransactionModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "No transaction found!");
    }
    return result;
});
const createTransactionOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.trackingNumber) {
        const isTransactionExists = yield transactions_model_1.TransactionModel.findOne({
            trackingNumber: payload === null || payload === void 0 ? void 0 : payload.trackingNumber,
        });
        if (isTransactionExists) {
            throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Transaction already happen!");
        }
    }
    payload.trackingNumber = (0, uuid_1.v4)();
    const result = yield transactions_model_1.TransactionModel.create(payload);
    return result;
});
exports.transactionServices = {
    createTransactionOnDB,
    getSingleTransactionFromDB,
    getAllTransactionsFromDB,
};
