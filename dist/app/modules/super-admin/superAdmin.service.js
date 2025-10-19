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
exports.superAdminServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const superAdmin_model_1 = require("./superAdmin.model");
const createSuperAdminOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield superAdmin_model_1.SuperAdmin.create(payload);
    return result;
});
const getAllSuperAdminFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const superAdminQuery = new QueryBuilder_1.default(superAdmin_model_1.SuperAdmin.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield superAdminQuery.modelQuery;
    return result;
});
const getSingleSuperAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield superAdmin_model_1.SuperAdmin.findById(id);
    return result;
});
exports.superAdminServices = {
    createSuperAdminOnDB,
    getAllSuperAdminFromDB,
    getSingleSuperAdminFromDB,
};
