"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const taxs_controller_1 = require("./taxs.controller");
const taxs_validations_1 = require("./taxs.validations");
const router = express_1.default.Router();
router.get("/", taxs_controller_1.taxControllers.getAllTaxes);
router.get("/:id", taxs_controller_1.taxControllers.getSingleTax);
router.post("/create-tax", (0, validateRequest_1.default)(taxs_validations_1.taxZodSchema), taxs_controller_1.taxControllers.createTax);
exports.TaxRoutes = router;
