"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shop_controller_1 = require("./shop.controller");
const shop_validations_1 = require("./shop.validations");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get("/", shop_controller_1.shopControllers.getAllShop);
router.get("/stats/all-shop-stats", shop_controller_1.shopControllers.getShopStats);
router.get("/:id", shop_controller_1.shopControllers.getSingleShop);
router.patch("/update-status/:id", (0, validateRequest_1.default)(shop_validations_1.shopStatusUpdateZodSchema), shop_controller_1.shopControllers.toggleShopStatus);
router.post("/create-shop/:id", multer_config_1.multerUpload.fields([
    { name: "shopLogofile", maxCount: 1 },
    { name: "shopCoverFile", maxCount: 1 },
]), (0, validateRequest_1.default)(shop_validations_1.createShopZodSchema), shop_controller_1.shopControllers.createShop);
router.patch("/update-shop/:id/:userId", multer_config_1.multerUpload.fields([
    { name: "shopLogofile", maxCount: 1 },
    { name: "shopCoverFile", maxCount: 1 },
]), (0, validateRequest_1.default)(shop_validations_1.updateShopZodSchema), shop_controller_1.shopControllers.updateShop);
router.delete("/delete-shop/:id", (0, validateRequest_1.default)(shop_validations_1.shopDeleteZodSchema), shop_controller_1.shopControllers.deleteShop);
router.get("/my-shop/:id", shop_controller_1.shopControllers.getMyShopData);
exports.ShopRoutes = router;
