import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { attributeControllers } from "./attributes.controller";
import { createAttributesZodSchema, updateAttributesZodSchema } from "./attributes.validations";

const router = express.Router();

router.get("/", attributeControllers.getAllAttributes);

router.get("/:id", attributeControllers.getSingleAttribute);

router.post(
  "/create-attribute",
  validateRequest(createAttributesZodSchema),
  attributeControllers.createAttribute
);
router.patch(
  '/update-attribute/:id',
  validateRequest(updateAttributesZodSchema),
  attributeControllers.updateAttribute
);

router.get('/stats/all', attributeControllers.getStats)

export const AttributeRoutes = router;
