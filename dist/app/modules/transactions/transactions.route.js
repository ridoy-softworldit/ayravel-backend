"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from "../../middlewares/validateRequest";
const transactions_controller_1 = require("./transactions.controller");
// import { createTransactionZodSchema } from "./transactions.validations";
const router = express_1.default.Router();
router.get("/", transactions_controller_1.transactionControllers.getAllTransaction);
router.get("/:id", transactions_controller_1.transactionControllers.getSingleTransaction);
// router.post(
//   "/create-transaction",
//   validateRequest(createTransactionZodSchema),
//   transactionControllers.createTransaction
// );
exports.TransactionRoutes = router;
