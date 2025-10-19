import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { superAdminControllers } from "./superAdmin.controller";
import { createSuperAdminZodSchema } from "./superAdmin.validations";

const router = express.Router();

router.get("/", superAdminControllers.getAllSuperAdmin);

router.get("/:id", superAdminControllers.getSingleSuperAdmin);

router.post(
  "/create-superAdmin",
  validateRequest(createSuperAdminZodSchema),
  superAdminControllers.createSuperAdmin
);

export const SuperAdminRoutes = router;
