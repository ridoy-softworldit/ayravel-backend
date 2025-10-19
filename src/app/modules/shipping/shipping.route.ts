import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { shippingControllers } from "./shipping.controller";
import { createShippingZodSchema } from "./shipping.validations";

const router = express.Router();

router.get("/", shippingControllers.getAllShipping);

router.get("/:id", shippingControllers.getSingleShipping);

router.post(
  "/create-shipping",
  validateRequest(createShippingZodSchema),
  shippingControllers.createShipping
);

export const ShippingRoutes = router;
