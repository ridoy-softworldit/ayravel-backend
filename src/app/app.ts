import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import expressSession from "express-session";
import morgan from "morgan";
import passport from "passport";
import "./../app/config/passport";
import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
const app: Application = express();

app.use(
  expressSession({
    secret: config.EXPRESS_SESSION as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//parsers
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ayravel-customer.vercel.app",
      "https://ayravel-admin-panel-nqo4.vercel.app",
      "https://aravel-backend-rho.vercel.app",


    ],
    credentials: true,
  })
);

//app routes
app.use("/api/v1", router);

//root route
app.get("/", (req: Request, res: Response) => {
  res.send("MegaMart server boosted on....🔥🔥🚀");
});

// //global error handler
app.use(globalErrorHandler);

// //not found route
app.use(notFound);

export default app;
