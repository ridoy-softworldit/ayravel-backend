import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { shopControllers } from "./shop.controller";
import {
  createShopZodSchema,
  shopDeleteZodSchema,
  shopStatusUpdateZodSchema,
  updateShopZodSchema,
} from "./shop.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", shopControllers.getAllShop);

router.get("/stats/all-shop-stats", shopControllers.getShopStats);

router.get("/:id", shopControllers.getSingleShop);

router.patch(
  "/update-status/:id",
  validateRequest(shopStatusUpdateZodSchema),
  shopControllers.toggleShopStatus
);

router.post(
  "/create-shop/:id",
  multerUpload.fields([
    { name: "shopLogofile", maxCount: 1 },
    { name: "shopCoverFile", maxCount: 1 },
  ]),
  validateRequest(createShopZodSchema),
  shopControllers.createShop
);

router.patch(
  "/update-shop/:id/:userId",
  multerUpload.fields([
    { name: "shopLogofile", maxCount: 1 },
    { name: "shopCoverFile", maxCount: 1 },
  ]),
  validateRequest(updateShopZodSchema),
  shopControllers.updateShop
);

router.delete(
  "/delete-shop/:id",
  validateRequest(shopDeleteZodSchema),
  shopControllers.deleteShop
);

router.get("/my-shop/:id", shopControllers.getMyShopData);

export const ShopRoutes = router;
