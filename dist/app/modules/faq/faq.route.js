"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faq_controller_1 = require("./faq.controller");
const faq_validations_1 = require("./faq.validations");
const router = express_1.default.Router();
router.get("/", faq_controller_1.faqControllers.getAllFaqs);
router.get("/:id", faq_controller_1.faqControllers.getSingleFaq);
router.post("/create-faq", (0, validateRequest_1.default)(faq_validations_1.createFaqZodSchema), faq_controller_1.faqControllers.createFaq);
exports.FaqRoutes = router;
