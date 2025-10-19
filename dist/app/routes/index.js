"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withdrawals_routes_1 = require("./../modules/withdrawals/withdrawals.routes");
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const category_routes_1 = require("../modules/category/category.routes");
const brands_routes_1 = require("../modules/brands/brands.routes");
const tags_routes_1 = require("../modules/tags/tags.routes");
const product_routes_1 = require("../modules/product/product.routes");
const coupons_route_1 = require("../modules/coupons/coupons.route");
const transactions_route_1 = require("../modules/transactions/transactions.route");
const order_route_1 = require("../modules/order/order.route");
const attributes_route_1 = require("../modules/attributes/attributes.route");
const shop_route_1 = require("../modules/shop/shop.route");
const transfer_route_1 = require("../modules/transfer/transfer.route");
const vendor_route_1 = require("../modules/vendor/vendor.route");
const customer_route_1 = require("../modules/customer/customer.route");
const superAdmin_route_1 = require("../modules/super-admin/superAdmin.route");
const terms_route_1 = require("../modules/terms/terms.route");
const taxs_route_1 = require("../modules/taxs/taxs.route");
const shipping_route_1 = require("../modules/shipping/shipping.route");
const faq_route_1 = require("../modules/faq/faq.route");
const orderStatus_route_1 = require("../modules/orderStatus/orderStatus.route");
const summary_route_1 = require("../modules/summary/summary.route");
const salesHistory_routes_1 = require("../modules/salesHistory/salesHistory.routes");
const dashboard_routes_1 = require("../modules/dashboard/dashboard.routes");
const becomeSellerReview_routes_1 = require("../modules/becomeSellerReview/becomeSellerReview.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/vendor",
        route: vendor_route_1.VendorRoutes,
    },
    {
        path: "/customer",
        route: customer_route_1.CustomerRoutes,
    },
    {
        path: "/super-admin",
        route: superAdmin_route_1.SuperAdminRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/brand",
        route: brands_routes_1.BrandRoutes,
    },
    {
        path: "/tag",
        route: tags_routes_1.TagRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.ProductRoutes,
    },
    {
        path: "/coupon",
        route: coupons_route_1.CouponRoutes,
    },
    {
        path: "/transaction",
        route: transactions_route_1.TransactionRoutes,
    },
    {
        path: "/order",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/attribute",
        route: attributes_route_1.AttributeRoutes,
    },
    {
        path: "/shop",
        route: shop_route_1.ShopRoutes,
    },
    {
        path: "/transfer",
        route: transfer_route_1.TransferRoutes,
    },
    {
        path: "/terms",
        route: terms_route_1.TermsRoutes,
    },
    {
        path: "/tax",
        route: taxs_route_1.TaxRoutes,
    },
    {
        path: "/shipping",
        route: shipping_route_1.ShippingRoutes,
    },
    {
        path: "/faq",
        route: faq_route_1.FaqRoutes,
    },
    {
        path: "/order-status",
        route: orderStatus_route_1.OrderStatusRoutes,
    },
    {
        path: "/summary",
        route: summary_route_1.SummaryRoutes,
    },
    {
        path: "/sales-history",
        route: salesHistory_routes_1.SalesHistoryRoutes,
    },
    {
        path: "/withdrawals",
        route: withdrawals_routes_1.WithdrawalRoutes,
    },
    {
        path: "/dashboard",
        route: dashboard_routes_1.DashboardRoutes,
    },
    {
        path: "/become-seller-reviews",
        route: becomeSellerReview_routes_1.BecomeSellerReviewRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route === null || route === void 0 ? void 0 : route.path, route === null || route === void 0 ? void 0 : route.route));
exports.default = router;
