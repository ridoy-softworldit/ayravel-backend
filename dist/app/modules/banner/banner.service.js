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
exports.bannerServices = exports.getAllBannersFromDB = exports.updateBannerFromDB = exports.createBannerFromDB = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const banner_model_1 = require("./banner.model");
const category_model_1 = require("../category/category.model");
const createBannerFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const banners = yield banner_model_1.BannerModel.find();
    if (banners.length >= 6) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Maximum 6 banners allowed. Please delete an existing banner before adding a new one.');
    }
    const result = yield banner_model_1.BannerModel.create(payload);
    return result;
});
exports.createBannerFromDB = createBannerFromDB;
const updateBannerFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const banners = yield banner_model_1.BannerModel.findById(id);
    if (!banners) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Banner not Found!');
    }
    const result = yield banner_model_1.BannerModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.updateBannerFromDB = updateBannerFromDB;
const getAllBannersFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const banners = yield banner_model_1.BannerModel.find();
    const categories = yield category_model_1.CategoryModel.find({ isFeatured: true }).populate('subCategories');
    const data = {
        banners: banners,
        categories: categories
    };
    return data;
});
exports.getAllBannersFromDB = getAllBannersFromDB;
exports.bannerServices = {
    createBannerFromDB: exports.createBannerFromDB,
    getAllBannersFromDB: exports.getAllBannersFromDB,
    updateBannerFromDB: exports.updateBannerFromDB,
};
