import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { faqControllers } from "./faq.controller";
import { createFaqZodSchema } from "./faq.validations";

const router = express.Router();

router.get("/", faqControllers.getAllFaqs);

router.get("/:id", faqControllers.getSingleFaq);

router.post(
  "/create-faq",
  validateRequest(createFaqZodSchema),
  faqControllers.createFaq
);

export const FaqRoutes = router;
