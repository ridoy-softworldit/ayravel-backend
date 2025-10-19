"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const customer_controller_1 = require("./customer.controller");
const customer_validations_1 = require("./customer.validations");
const router = express_1.default.Router();
router.get("/", customer_controller_1.customerControllers.getAllCustomer);
router.get("/:id", customer_controller_1.customerControllers.getSingleCustomer);
router.get("/my-info/:id", customer_controller_1.customerControllers.getMyCustomerInfo);
router.post("/create-customer", (0, validateRequest_1.default)(customer_validations_1.createCustomerZodSchema), customer_controller_1.customerControllers.createCustomer);
router.patch("/update-customer/:id", (0, validateRequest_1.default)(customer_validations_1.updateCustomerZodSchema), customer_controller_1.customerControllers.updateCustomer);
exports.CustomerRoutes = router;
