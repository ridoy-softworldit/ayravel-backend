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
exports.becomeSellerReviewServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const becomeSellerReview_model_1 = require("./becomeSellerReview.model");
const http_status_1 = __importDefault(require("http-status"));
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield becomeSellerReview_model_1.BecomeSellerReviewModel.find();
    return result;
});
const getSingleReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield becomeSellerReview_model_1.BecomeSellerReviewModel.findById(id);
    return result;
});
const createReviewOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isReviewExists = yield becomeSellerReview_model_1.BecomeSellerReviewModel.findOne({
        title: payload === null || payload === void 0 ? void 0 : payload.title,
        "userInfo.name": (_a = payload === null || payload === void 0 ? void 0 : payload.userInfo) === null || _a === void 0 ? void 0 : _a.name,
    });
    if (isReviewExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Review Already Exists by this user!");
    }
    const result = yield becomeSellerReview_model_1.BecomeSellerReviewModel.create(payload);
    return result;
});
exports.becomeSellerReviewServices = {
    getAllReviewsFromDB,
    getSingleReviewFromDB,
    createReviewOnDB,
};
