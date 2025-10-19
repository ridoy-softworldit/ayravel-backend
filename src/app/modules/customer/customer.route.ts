import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { customerControllers } from "./customer.controller";
import {
  createCustomerZodSchema,
  updateCustomerZodSchema,
} from "./customer.validations";

const router = express.Router();

router.get("/", customerControllers.getAllCustomer);

router.get("/:id", customerControllers.getSingleCustomer);

router.get("/my-info/:id", customerControllers.getMyCustomerInfo);

router.post(
  "/create-customer",
  validateRequest(createCustomerZodSchema),
  customerControllers.createCustomer
);

router.patch(
  "/update-customer/:id",
  validateRequest(updateCustomerZodSchema),
  customerControllers.updateCustomer
);

export const CustomerRoutes = router;
