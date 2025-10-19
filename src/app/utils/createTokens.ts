import config from "../config";
import { TUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<TUser>) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // ✅ Use fallback or explicit runtime check
  const accessSecret = config.jwt_access_secret || "";
  const refreshSecret = config.JWT_REFRESH_SECRET || "";

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

  const accessToken = generateToken(
    payload,
    accessSecret,
    config.JWT_ACCESS_EXPIRES || "1d"
  );

  const refreshToken = generateToken(
    payload,
    refreshSecret,
    config.JWT_REFRESH_EXPIRES || "7d"
  );

  return { accessToken, refreshToken };
};
