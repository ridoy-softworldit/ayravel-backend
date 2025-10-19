"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const transfer_controller_1 = require("./transfer.controller");
const transfer_validtions_1 = require("./transfer.validtions");
const router = express_1.default.Router();
router.get("/", transfer_controller_1.transferControllers.getAllTransfer);
router.get("/:id", transfer_controller_1.transferControllers.getSingleTransfer);
router.post("/create-transfer", (0, validateRequest_1.default)(transfer_validtions_1.createTransferZodSchema), transfer_controller_1.transferControllers.createTransfer);
exports.TransferRoutes = router;
