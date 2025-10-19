"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    // Set the status code and send the response
    res.status((data === null || data === void 0 ? void 0 : data.statusCode) || 200).json({
        success: (data === null || data === void 0 ? void 0 : data.success) || true,
        message: (data === null || data === void 0 ? void 0 : data.message) || "Success",
        data: (data === null || data === void 0 ? void 0 : data.data) || null
    });
};
exports.default = sendResponse;
