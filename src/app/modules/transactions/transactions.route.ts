import express from "express";
// import validateRequest from "../../middlewares/validateRequest";
import { transactionControllers } from "./transactions.controller";
// import { createTransactionZodSchema } from "./transactions.validations";

const router = express.Router();

router.get("/", transactionControllers.getAllTransaction);

router.get("/:id", transactionControllers.getSingleTransaction);

// router.post(
//   "/create-transaction",
//   validateRequest(createTransactionZodSchema),
//   transactionControllers.createTransaction
// );

export const TransactionRoutes = router;
