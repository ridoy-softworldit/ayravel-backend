import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { tagControllers } from "./tags.controllers";
import { createTagZodSchema, updateTagZodSchema } from "./tags.validations";

const router = express.Router();

router.get("/", tagControllers.getAllTags);

router.get("/:id", tagControllers.getSingleTag);

router.post(
  "/create-tag",
  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(createTagZodSchema),
  tagControllers.createTag
);

router.patch(
  "/update-tag/:id",
  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(updateTagZodSchema),
  tagControllers.updateTag
);

router.get("/stats/all", tagControllers.getStatus);

export const TagRoutes = router;
