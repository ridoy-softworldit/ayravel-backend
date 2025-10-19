import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { summaryControllers } from "./summary.controller";
import { createSummaryZodSchema } from "./summary.validations";

const router = express.Router();

// 🔹 Get all summaries
router.get("/", summaryControllers.getAllSummaries);

// 🔹 Get single summary
router.get("/:id", summaryControllers.getSingleSummary);

// 🔹 Create new summary
router.post(
  "/create-summary",
  validateRequest(createSummaryZodSchema),
  summaryControllers.createSummary
);

// // 🔹 Update summary
// router.patch(
//   "/:id",
//   validateRequest(createSummaryZodSchema),
//   summaryControllers.updateSummary
// );

// // 🔹 Delete summary
// router.delete("/:id", summaryControllers.deleteSummary);

export const SummaryRoutes = router;
