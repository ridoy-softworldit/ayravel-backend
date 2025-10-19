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
exports.faqServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const faq_model_1 = require("./faq.model");
const createFaqOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FaqModel.create(payload);
    return result;
});
const getAllFaqsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const faqQuery = new QueryBuilder_1.default(faq_model_1.FaqModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield faqQuery.modelQuery;
    return result;
});
const getSingleFaqFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FaqModel.findById(id);
    return result;
});
exports.faqServices = {
    createFaqOnDB,
    getAllFaqsFromDB,
    getSingleFaqFromDB,
};
