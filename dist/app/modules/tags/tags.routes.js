"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tags_controllers_1 = require("./tags.controllers");
const tags_validations_1 = require("./tags.validations");
const router = express_1.default.Router();
router.get("/", tags_controllers_1.tagControllers.getAllTags);
router.get("/:id", tags_controllers_1.tagControllers.getSingleTag);
router.post("/create-tag", multer_config_1.multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
]), (0, validateRequest_1.default)(tags_validations_1.createTagZodSchema), tags_controllers_1.tagControllers.createTag);
router.patch("/update-tag/:id", multer_config_1.multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
]), (0, validateRequest_1.default)(tags_validations_1.updateTagZodSchema), tags_controllers_1.tagControllers.updateTag);
router.get("/stats/all", tags_controllers_1.tagControllers.getStatus);
exports.TagRoutes = router;
