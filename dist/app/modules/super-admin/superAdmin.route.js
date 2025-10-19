"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const superAdmin_controller_1 = require("./superAdmin.controller");
const superAdmin_validations_1 = require("./superAdmin.validations");
const router = express_1.default.Router();
router.get("/", superAdmin_controller_1.superAdminControllers.getAllSuperAdmin);
router.get("/:id", superAdmin_controller_1.superAdminControllers.getSingleSuperAdmin);
router.post("/create-superAdmin", (0, validateRequest_1.default)(superAdmin_validations_1.createSuperAdminZodSchema), superAdmin_controller_1.superAdminControllers.createSuperAdmin);
exports.SuperAdminRoutes = router;
