import { Router } from "express";
import { statsController } from "./stats.controller";



const router = Router()






router.get('/admin', statsController.getAdminStats)
router.get('/vendor/:id', statsController.getVendorStats)





export const statsRoute = router