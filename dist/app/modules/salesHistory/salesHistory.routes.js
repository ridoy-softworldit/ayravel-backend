"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesHistoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const salesHistory_controller_1 = require("./salesHistory.controller");
const salesHistory_validations_1 = require("./salesHistory.validations");
const router = express_1.default.Router();
router.get("/", salesHistory_controller_1.salesHistoryControllers.getAllSalesHistory);
router.get("/:id", salesHistory_controller_1.salesHistoryControllers.getSingleSalesHistory);
router.post("/create-sales-history", (0, validateRequest_1.default)(salesHistory_validations_1.createSalesHistoryZodSchema), salesHistory_controller_1.salesHistoryControllers.createSalesHistory);
exports.SalesHistoryRoutes = router;
