"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
// import auth from "../../middlewares/auth";
// import { userRole } from "./user.const";
const router = express_1.default.Router();
//individual routes
//get all user
router.get("/", 
// auth(userRole["admin"]),
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllUser);
//get all admin user
router.get("/admins", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllAdminUser);
//get all vendor user
router.get("/vendors", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllVendorUser);
//get super admin
router.get("/admins/:id", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getSuperAdmin);
router.get("/:id", user_controller_1.UserControllers.getSingleUser);
router.patch("/:id", user_controller_1.UserControllers.updateUser);
exports.UserRoutes = router;
