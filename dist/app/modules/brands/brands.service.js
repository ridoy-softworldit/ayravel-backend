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
exports.brandServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const brands_model_1 = require("./brands.model");
const getAllBrandsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_model_1.BrandModel.find();
    return result;
});
const getSingleBrandFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_model_1.BrandModel.findById(id);
    return result;
});
const createBrandOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExists = yield brands_model_1.BrandModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (isBrandExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Brand Already Exists!");
    }
    const result = yield brands_model_1.BrandModel.create(payload);
    return result;
});
const updateSingleBrandOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_model_1.BrandModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.brandServices = {
    getAllBrandsFromDB,
    getSingleBrandFromDB,
    createBrandOnDB,
    updateSingleBrandOnDB,
};
