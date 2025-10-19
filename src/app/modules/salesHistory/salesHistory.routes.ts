import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { salesHistoryControllers } from "./salesHistory.controller";
import { createSalesHistoryZodSchema } from "./salesHistory.validations";

const router = express.Router();

router.get("/", salesHistoryControllers.getAllSalesHistory);

router.get("/:id", salesHistoryControllers.getSingleSalesHistory);

router.post(
  "/create-sales-history",
  validateRequest(createSalesHistoryZodSchema),
  salesHistoryControllers.createSalesHistory
);

export const SalesHistoryRoutes = router;
