"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vendor_controller_1 = require("./vendor.controller");
const vendor_validations_1 = require("./vendor.validations");
const router = express_1.default.Router();
router.get("/", vendor_controller_1.vendorControllers.getAllVendor);
router.get("/:id", vendor_controller_1.vendorControllers.getSingleVendor);
router.post("/create-vendor", (0, validateRequest_1.default)(vendor_validations_1.createVendorZodSchema), vendor_controller_1.vendorControllers.createVendor);
exports.VendorRoutes = router;
