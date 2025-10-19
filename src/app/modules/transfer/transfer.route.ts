import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { transferControllers } from "./transfer.controller";
import { createTransferZodSchema } from "./transfer.validtions";

const router = express.Router();

router.get("/", transferControllers.getAllTransfer);

router.get("/:id", transferControllers.getSingleTransfer);

router.post(
  "/create-transfer",
  validateRequest(createTransferZodSchema),
  transferControllers.createTransfer
);

export const TransferRoutes = router;
