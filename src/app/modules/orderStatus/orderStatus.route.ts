import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderStatusControllers } from "./orderStatus.controller";
import { createOrderStatusZodSchema } from "./orderStatus.validations";

const router = express.Router();

router.get("/", orderStatusControllers.getAllOrderStatus);

router.get("/:id", orderStatusControllers.getSingleOrderStatus);

router.post(
  "/create-order-status",
  validateRequest(createOrderStatusZodSchema),
  orderStatusControllers.createOrderStatus
);

// router.patch(
//   "/:id",
//   validateRequest(createOrderStatusZodSchema),
//   orderStatusControllers.updateOrderStatus
// );

// router.delete("/:id", orderStatusControllers.deleteOrderStatus);

export const OrderStatusRoutes = router;
