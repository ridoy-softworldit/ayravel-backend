import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { categoryControllers } from "./category.controller";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validations";

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.get("/:id", categoryControllers.getSingleCategory);

router.post(
  "/create-category",
  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(createCategoryZodSchema),
  categoryControllers.createCategory
);

router.patch(
  "/edit-category/:id",
  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(updateCategoryZodSchema),
  categoryControllers.editCategory
);

router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
