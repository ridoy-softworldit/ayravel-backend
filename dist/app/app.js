"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
require("./../app/config/passport");
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://ayravel-customer.vercel.app",
        "https://ayravel-admin-panel-nqo4.vercel.app"
    ],
    credentials: true
}));
app.use((0, express_session_1.default)({
    secret: config_1.default.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
//app routes
app.use("/api/v1", routes_1.default);
//root route
app.get("/", (req, res) => {
    res.send("MegaMart server boosted on....🔥🔥🚀");
});
// //global error handler
app.use(globalErrorHandler_1.default);
// //not found route
app.use(notFound_1.default);
exports.default = app;
