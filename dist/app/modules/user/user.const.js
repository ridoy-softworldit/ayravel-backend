"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRole = exports.userStatus = exports.possibleGenders = exports.userRoles = void 0;
exports.userRoles = [
    "customer",
    "vendor",
    "vendor-staff",
    "admin",
    "admin-staff",
    "super-admin",
    "sr",
    "seller",
];
exports.possibleGenders = ["male", "female", "other"];
exports.userStatus = ["active", "pending", "blocked"];
exports.userRole = {
    customer: "customer",
    admin: "admin",
    "super-admin": "super-admin",
    vendor: "vendor",
};
