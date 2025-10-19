"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const summary_controller_1 = require("./summary.controller");
const summary_validations_1 = require("./summary.validations");
const router = express_1.default.Router();
// 🔹 Get all summaries
router.get("/", summary_controller_1.summaryControllers.getAllSummaries);
// 🔹 Get single summary
router.get("/:id", summary_controller_1.summaryControllers.getSingleSummary);
// 🔹 Create new summary
router.post("/create-summary", (0, validateRequest_1.default)(summary_validations_1.createSummaryZodSchema), summary_controller_1.summaryControllers.createSummary);
// // 🔹 Update summary
// router.patch(
//   "/:id",
//   validateRequest(createSummaryZodSchema),
//   summaryControllers.updateSummary
// );
// // 🔹 Delete summary
// router.delete("/:id", summaryControllers.deleteSummary);
exports.SummaryRoutes = router;
