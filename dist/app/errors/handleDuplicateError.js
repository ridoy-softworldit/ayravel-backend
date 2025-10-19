"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const statusCode = 400;
    const errorSources = [
        {
            path: Object.keys(error === null || error === void 0 ? void 0 : error.keyValue)[0],
            message: `${error.keyValue[Object.keys(error === null || error === void 0 ? void 0 : error.keyValue)[0]]} is already Exist`,
        },
    ];
    return {
        statusCode,
        message: 'Duplicate Error',
        errorSources: errorSources,
    };
};
exports.default = handleDuplicateError;
