"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRoute = void 0;
const express_1 = require("express");
const stats_controller_1 = require("./stats.controller");
const router = (0, express_1.Router)();
router.get('/admin', stats_controller_1.statsController.getAdminStats);
router.get('/vendor/:id', stats_controller_1.statsController.getVendorStats);
exports.statsRoute = router;
