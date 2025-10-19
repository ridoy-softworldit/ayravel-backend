"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const withdrawals_controller_1 = require("./withdrawals.controller");
const withdrawals_validations_1 = require("./withdrawals.validations");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(withdrawals_validations_1.createWithdrawalZodSchema), withdrawals_controller_1.WithdrawalControllers.createWithdrawal);
router.get("/", withdrawals_controller_1.WithdrawalControllers.getWithdrawals);
router.get("/:id", withdrawals_controller_1.WithdrawalControllers.getSingleWithdrawal);
router.get("/my-withdrawals/:userId", withdrawals_controller_1.WithdrawalControllers.getUserWithdrawals);
router.patch("/:id", (0, validateRequest_1.default)(withdrawals_validations_1.createWithdrawalZodSchema.partial()), withdrawals_controller_1.WithdrawalControllers.updateWithdrawal);
router.delete("/:id", withdrawals_controller_1.WithdrawalControllers.deleteWithdrawal);
exports.WithdrawalRoutes = router;
