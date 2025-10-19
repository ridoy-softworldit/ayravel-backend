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
exports.attributeServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const attributes_model_1 = require("./attributes.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getAllAttributesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeQuery = new QueryBuilder_1.QueryBuilder(attributes_model_1.AttributesModel.find(), query);
    const SearchableFields = ['name'];
    const allAttributes = attributeQuery
        .search(SearchableFields)
        .filter()
        .sort()
        .paginate();
    allAttributes.modelQuery = allAttributes.modelQuery.populate({
        path: 'category',
        select: 'name -_id'
    });
    const [data, meta] = yield Promise.all([
        allAttributes.build().exec(),
        attributeQuery.getMeta(),
    ]);
    const result = { data, meta };
    return result;
});
const getSingleAttributeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = attributes_model_1.AttributesModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Attribute does not exists!");
    }
    return result;
});
const getStatsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const stats = yield attributes_model_1.AttributesModel.aggregate([
        {
            $facet: {
                totalAttributes: [{ $count: 'count' }],
                requiredAttributes: [
                    { $match: { required: true } },
                    { $count: 'count' },
                ],
                dropdownAttributes: [
                    { $match: { type: 'dropdown' } },
                    { $count: 'count' },
                ],
                categories: [
                    { $match: { category: { $exists: true, $ne: null } } },
                    { $group: { _id: '$category' } },
                    { $count: 'count' },
                ],
            },
        },
    ]);
    // result structured nicely
    return {
        totalAttributes: ((_a = stats[0].totalAttributes[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
        requiredAttributes: ((_b = stats[0].requiredAttributes[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
        dropdownAttributes: ((_c = stats[0].dropdownAttributes[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
        categories: ((_d = stats[0].categories[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
    };
});
const createAttributeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAttributeExists = yield attributes_model_1.AttributesModel.findOne({
        name: payload === null || payload === void 0 ? void 0 : payload.name,
    });
    if (isAttributeExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Attribute already exists!");
    }
    payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(" ").join("-");
    const result = yield attributes_model_1.AttributesModel.create(payload);
    return result;
});
const updateAttributeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAttributeExists = yield attributes_model_1.AttributesModel.findById(id);
    if (!isAttributeExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, 'Attribute does not exist!');
    }
    if (payload.name) {
        payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(' ').join('-');
    }
    const result = yield attributes_model_1.AttributesModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
});
exports.attributeServices = {
    getAllAttributesFromDB,
    getSingleAttributeFromDB,
    createAttributeIntoDB,
    updateAttributeIntoDB,
    getStatsFromDB,
};
