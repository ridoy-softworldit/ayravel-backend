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
exports.transferServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const transfer_model_1 = require("./transfer.model");
const transfer_consts_1 = require("./transfer.consts");
const getAllTransfersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transferQuery = new QueryBuilder_1.default(transfer_model_1.TransferModel.find(), query)
        .search(transfer_consts_1.TransferSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield transferQuery.modelQuery;
    return result;
});
const getSingleTransferFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = transfer_model_1.TransferModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Transfer does not exists!");
    }
    return result;
});
const createTransferIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transfer_model_1.TransferModel.create(payload);
    return result;
});
exports.transferServices = {
    getAllTransfersFromDB,
    getSingleTransferFromDB,
    createTransferIntoDB,
};
