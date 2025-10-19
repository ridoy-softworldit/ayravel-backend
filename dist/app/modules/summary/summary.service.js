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
exports.summaryServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const summary_model_1 = require("./summary.model");
const summary_consts_1 = require("./summary.consts");
// 🔹 Get all summaries
const getAllSummariesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const summaryQuery = new QueryBuilder_1.default(summary_model_1.SummaryModel.find(), query)
        .search(summary_consts_1.SummarySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield summaryQuery.modelQuery;
    return result;
});
// 🔹 Get single summary by ID
const getSingleSummaryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield summary_model_1.SummaryModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Summary does not exist!");
    }
    return result;
});
// 🔹 Create new summary
const createSummaryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield summary_model_1.SummaryModel.create(payload);
    return result;
});
// 🔹 Update summary
const updateSummaryInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield summary_model_1.SummaryModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Summary does not exist!");
    }
    return result;
});
// 🔹 Delete summary
const deleteSummaryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield summary_model_1.SummaryModel.findByIdAndDelete(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Summary does not exist!");
    }
    return result;
});
exports.summaryServices = {
    getAllSummariesFromDB,
    getSingleSummaryFromDB,
    createSummaryIntoDB,
    updateSummaryInDB,
    deleteSummaryFromDB,
};
