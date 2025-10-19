"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shipping_controller_1 = require("./shipping.controller");
const shipping_validations_1 = require("./shipping.validations");
const router = express_1.default.Router();
router.get("/", shipping_controller_1.shippingControllers.getAllShipping);
router.get("/:id", shipping_controller_1.shippingControllers.getSingleShipping);
router.post("/create-shipping", (0, validateRequest_1.default)(shipping_validations_1.createShippingZodSchema), shipping_controller_1.shippingControllers.createShipping);
exports.ShippingRoutes = router;
