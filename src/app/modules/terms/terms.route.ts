import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { termsControllers } from "./terms.controller";
import { termsAndConditionsZodSchema } from "./terms.validations";

const router = express.Router();

router.get("/", termsControllers.getAllTerms);

router.get("/:id", termsControllers.getSingleTerms);

router.post(
  "/create-terms",
  validateRequest(termsAndConditionsZodSchema),
  termsControllers.createTerms
);

export const TermsRoutes = router;
