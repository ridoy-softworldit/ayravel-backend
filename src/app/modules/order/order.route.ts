import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderControllers } from "./order.controller";
import { createOrderZodSchema } from "./order.validation";

const router = express.Router();

router.get("/", orderControllers.getAllOrder);
router.get("/summary", orderControllers.getOrderSummary);

router.get("/my-order/:id", orderControllers.getMyOrders);

router.get("/:id", orderControllers.getSingleOrder);

router.get("/commission/:id", orderControllers.getUserCommissionSummary);

router.post(
  "/create-order",
  validateRequest(createOrderZodSchema),
  orderControllers.createOrder
);

router.patch("/status/:id", orderControllers.updateOrderStatus);

router.patch("/:id", orderControllers.updateOrder);

export const OrderRoutes = router;
