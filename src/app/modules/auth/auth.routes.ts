import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validations";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRoles } from "../user/user.const";

const router = express.Router();

// Individual routes

router.post(
  "/register",
  validateRequest(AuthValidations.registerUser),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginUser),
  AuthController.loginUser
);

router.post("/logout/:id", AuthController.logOutUser);

router.post(
  "/login/provider",
  validateRequest(AuthValidations.loginUserUsingProvider),
  AuthController.loginUserUsingProvider
);



router.get('/google', async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || ''
  passport.authenticate("google", {scope: ["profile","email"],state: redirect as string })(req, res,next)
})
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthController.googleCallbackController)



router.get('/me', checkAuth(...Object.values(userRoles)), AuthController.gatMe);

export const AuthRoutes = router;
