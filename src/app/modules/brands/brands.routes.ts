import express from "express";
import { brandsControllers } from "./brands.controller";

const router = express.Router();

router.get("/", brandsControllers.getAllBrands);

router.get("/:id", brandsControllers.getSingleBrand);

router.post("/create-brand", brandsControllers.createBrand);

router.patch("/edit-brand/:id", brandsControllers.updateBrand);

export const BrandRoutes = router;
