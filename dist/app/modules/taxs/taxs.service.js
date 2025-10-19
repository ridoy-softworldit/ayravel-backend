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
exports.taxServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const taxs_model_1 = require("./taxs.model");
const createTaxOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield taxs_model_1.TaxModel.create(payload);
    return result;
});
const getAllTaxesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const taxQuery = new QueryBuilder_1.default(taxs_model_1.TaxModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield taxQuery.modelQuery;
    return result;
});
const getSingleTaxFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield taxs_model_1.TaxModel.findById(id);
    return result;
});
exports.taxServices = {
    createTaxOnDB,
    getAllTaxesFromDB,
    getSingleTaxFromDB,
};
