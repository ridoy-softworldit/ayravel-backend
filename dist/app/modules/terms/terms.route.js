"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const terms_controller_1 = require("./terms.controller");
const terms_validations_1 = require("./terms.validations");
const router = express_1.default.Router();
router.get("/", terms_controller_1.termsControllers.getAllTerms);
router.get("/:id", terms_controller_1.termsControllers.getSingleTerms);
router.post("/create-terms", (0, validateRequest_1.default)(terms_validations_1.termsAndConditionsZodSchema), terms_controller_1.termsControllers.createTerms);
exports.TermsRoutes = router;
