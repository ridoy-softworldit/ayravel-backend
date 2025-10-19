import { Router } from "express";
import { bannerController } from "./banner.controller";



const router = Router()




router.post('/create', bannerController.createBanner)
router.post('/update/:id', bannerController.updateBanner);
router.get('/', bannerController.getAllBanners);



export const bannerRoute = router