"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const dashboard_controller_1 = require("./dashboard.controller");
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const dashboard_validations_1 = require("./dashboard.validations");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(dashboard_validations_1.dashboardValidation), dashboard_controller_1.dashboardControllers.createDashboard);
router.get("/", dashboard_controller_1.dashboardControllers.getAllDashboards);
// router.get("/:id", dashboardControllers.getDashboardById);
// router.patch(
//   "/:id",
//   validateRequest(dashboardValidation.partial()),
//   dashboardControllers.updateDashboard
// );
// router.delete("/:id", dashboardControllers.deleteDashboard);
exports.DashboardRoutes = router;
