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
exports.tagControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tags_services_1 = require("./tags.services");
const getAllTags = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_services_1.tagServices.getAllTagsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tags retrieve successfully!",
        data: result,
    });
}));
const getSingleTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield tags_services_1.tagServices.getSingleTagFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag data retrieve successfully!",
        data: result,
    });
}));
// Create Tag
const createTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = req.files || {};
    const body = req.body;
    const tagData = Object.assign(Object.assign({}, body), { image: ((_b = (_a = files["image"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || body.image || "", icon: {
            name: body.icon.name || body["icon.name"], //  Support both formData and JSON
            url: ((_d = (_c = files["icon"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || body.iconUrl || "",
        } });
    const result = yield tags_services_1.tagServices.createTagOnDB(tagData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag created successfully!",
        data: result,
    });
}));
// Update Tag
const updateTag = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const files = req.files || {};
    const body = req.body;
    const tagData = Object.assign({}, body);
    if ((_b = (_a = files["image"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        tagData.image = files["image"][0].path;
    }
    if (((_d = (_c = files["icon"]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || body.iconName || body.iconUrl) {
        tagData.icon = {
            name: body.icon.name || body["icon.name"],
            url: ((_f = (_e = files["icon"]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path) || body.iconUrl || "",
        };
    }
    const result = yield tags_services_1.tagServices.updateTagOnDB(req.params.id, tagData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag updated successfully!",
        data: result,
    });
}));
const getStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tags_services_1.tagServices.getStatus();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tag updated successfully!",
        data: result,
    });
}));
exports.tagControllers = {
    getAllTags,
    getSingleTag,
    createTag,
    updateTag,
    getStatus,
};
