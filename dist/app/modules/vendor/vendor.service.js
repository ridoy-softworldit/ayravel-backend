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
exports.vendorServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const vendor_consts_1 = require("./vendor.consts");
const vendor_model_1 = require("./vendor.model");
const createVendorOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_model_1.VendorModel.create(payload);
    return result;
});
const getAllVendorFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = new QueryBuilder_1.default(vendor_model_1.VendorModel.find(), query)
        .search(vendor_consts_1.VendorSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield vendorQuery.modelQuery;
    return result;
});
const getSingleVendorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_model_1.VendorModel.findById(id);
    return result;
});
exports.vendorServices = {
    createVendorOnDB,
    getAllVendorFromDB,
    getSingleVendorFromDB,
};
