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
exports.tagServices = exports.getStatus = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const tags_model_1 = require("./tags.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const product_model_1 = require("../product/product.model");
const getAllTagsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = tags_model_1.TagModel.find();
    const queryBuilder = new QueryBuilder_1.QueryBuilder(result, query);
    const tagSearchableFields = [
        'name',
    ];
    const allTags = queryBuilder.search(tagSearchableFields).filter().sort().paginate();
    const [data, meta] = yield Promise.all([
        allTags.build().exec(),
        queryBuilder.getMeta()
    ]);
    return {
        data, meta
    };
});
const getSingleTagFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_model_1.TagModel.findById(id);
    return result;
});
const createTagOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTagExists = yield tags_model_1.TagModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    if (isTagExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, "Tag Already Exists!");
    }
    payload.slug = payload === null || payload === void 0 ? void 0 : payload.name.split(" ").join("-");
    const result = yield tags_model_1.TagModel.create(payload);
    return result;
});
const updateTagOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTagExists = yield tags_model_1.TagModel.findById(id);
    if (!isTagExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, 'Tag dose not Exists!');
    }
    const result = yield tags_model_1.TagModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    if (payload.deletedImage) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(payload.deletedImage);
    }
    return result;
});
const getStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTags = yield tags_model_1.TagModel.countDocuments();
    const taggedProducts = yield product_model_1.ProductModel.countDocuments({
        'brandAndCategories.tags.0': { $exists: true },
    });
    const tagTypesAgg = yield tags_model_1.TagModel.aggregate([
        { $match: { type: { $exists: true, $ne: '' } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', count: 1 } },
    ]);
    const mostUsedTagAgg = yield product_model_1.ProductModel.aggregate([
        { $unwind: '$brandAndCategories.tags' },
        { $group: { _id: '$brandAndCategories.tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: 'tags',
                localField: '_id',
                foreignField: '_id',
                as: 'tag',
            },
        },
        { $unwind: '$tag' },
        { $project: { _id: 0, name: '$tag.name', count: 1 } },
    ]);
    return { totalTags, tagTypesAgg, taggedProducts, mostUsedTagAgg };
});
exports.getStatus = getStatus;
exports.tagServices = {
    getAllTagsFromDB,
    getSingleTagFromDB,
    createTagOnDB,
    updateTagOnDB,
    getStatus: exports.getStatus,
};
