"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const attributes_controller_1 = require("./attributes.controller");
const attributes_validations_1 = require("./attributes.validations");
const router = express_1.default.Router();
router.get("/", attributes_controller_1.attributeControllers.getAllAttributes);
router.get("/:id", attributes_controller_1.attributeControllers.getSingleAttribute);
router.post("/create-attribute", (0, validateRequest_1.default)(attributes_validations_1.createAttributesZodSchema), attributes_controller_1.attributeControllers.createAttribute);
router.patch('/update-attribute/:id', (0, validateRequest_1.default)(attributes_validations_1.updateAttributesZodSchema), attributes_controller_1.attributeControllers.updateAttribute);
router.get('/stats/all', attributes_controller_1.attributeControllers.getStats);
exports.AttributeRoutes = router;
