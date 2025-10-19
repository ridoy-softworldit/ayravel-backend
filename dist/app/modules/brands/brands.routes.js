"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const brands_controller_1 = require("./brands.controller");
const router = express_1.default.Router();
router.get("/", brands_controller_1.brandsControllers.getAllBrands);
router.get("/:id", brands_controller_1.brandsControllers.getSingleBrand);
router.post("/create-brand", brands_controller_1.brandsControllers.createBrand);
router.patch("/edit-brand/:id", brands_controller_1.brandsControllers.updateBrand);
exports.BrandRoutes = router;
