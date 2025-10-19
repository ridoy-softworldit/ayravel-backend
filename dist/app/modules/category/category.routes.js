"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validations_1 = require("./category.validations");
const router = express_1.default.Router();
router.get("/", category_controller_1.categoryControllers.getAllCategory);
router.get("/:id", category_controller_1.categoryControllers.getSingleCategory);
router.post("/create-category", multer_config_1.multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "icon", maxCount: 1 },
]), (0, validateRequest_1.default)(category_validations_1.createCategoryZodSchema), category_controller_1.categoryControllers.createCategory);
router.patch("/edit-category/:id", multer_config_1.multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "icon", maxCount: 1 },
]), (0, validateRequest_1.default)(category_validations_1.updateCategoryZodSchema), category_controller_1.categoryControllers.editCategory);
router.delete("/delete-category/:id", category_controller_1.categoryControllers.deleteCategory);
exports.CategoryRoutes = router;
