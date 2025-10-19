import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { taxControllers } from "./taxs.controller";
import { taxZodSchema } from "./taxs.validations";

const router = express.Router();

router.get("/", taxControllers.getAllTaxes);

router.get("/:id", taxControllers.getSingleTax);

router.post(
  "/create-tax",
  validateRequest(taxZodSchema),
  taxControllers.createTax
);

export const TaxRoutes = router;
