// import config from '../../config';
// import { UserModel } from '../user/user.model';
// import { TAuth, TExternalProviderAuth } from './auth.interface';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import AppError from '../../errors/handleAppError';
// import httpStatus from 'http-status';
// import { StatusCodes } from 'http-status-codes';

// //register a user in database
// const registerUserOnDB = async (payload: TAuth) => {
//   const result = await UserModel.create(payload);
//   return result;
// };

// //login an user with credentials
// const loginUserFromDB = async (payload: TAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });

//   if (!isUserExists) {
//     throw Error('User does not exists!');
//   }

//   if (!isUserExists?.password) {
//     throw new Error(
//       'This account is registered via Google login. Please use Google login.'
//     );
//   }

//   if (!payload?.password) {
//     throw new Error('Password is required');
//   }
//   const isPasswordMatched = await bcrypt.compare(
//     payload.password,
//     isUserExists.password
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Wrong Credentials!');
//   }

//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );

//   return user;
// };

// //login an user with credentials
// const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });

//   // Check if a user exists with the provided email
//   if (!isUserExists) {
//     const result = await UserModel.create(payload);

//     const jwtPayload = {
//       email: result?.email,
//       role: result?.role,
//     };

//     //token
//     const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//       expiresIn: '24h',
//     });

//     const userObject = {
//       user: result,
//       accessToken: token,
//     };

//     return userObject;
//   }

//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );

//   //generating token
//   const jwtPayload = {
//     email: isUserExists?.email,
//     role: isUserExists?.role,
//   };

//   //token
//   const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//     expiresIn: '24h',
//   });

//   const userObject = {
//     user: user,
//     accessToken: token,
//   };

//   return userObject;
// };

// //logout current user and removing token from cookie
// const logoutUserFromDB = async (id: string) => {
//   await UserModel.findByIdAndUpdate(id, { status: 'inActive' }, { new: true });
//   return {};
// };

// const getMe = async (decodedUser: JwtPayload) => {
//   const me = await UserModel.findById(decodedUser.userId).select('-password');

//   if (!me) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   return me;
// };

// export const AuthServices = {
//   registerUserOnDB,
//   loginUserFromDB,
//   logoutUserFromDB,
//   loginUserUsingProviderFromDB,
//   getMe,
// };

import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/handleAppError";
import { UserModel } from "../user/user.model";
import { TAuth, TExternalProviderAuth } from "./auth.interface";

/**
 * Register user in the database
 * Sets default status based on user role:
 * - 'active' for customer, admin, super-admin
 * - 'pending' for others
 */
const registerUserOnDB = async (payload: TAuth) => {
  // Determine user status based on role
  const activeRoles = ["customer", "admin", "super-admin"];
  const role = payload.role || "customer";
  const status = activeRoles.includes(role) ? "active" : "pending";

  const userData = {
    ...payload,
    role,
    status,
  };

  const result = await UserModel.create(userData);
  return result;
};

/**
 * Login a user using email/password
 */
const loginUserFromDB = async (payload: TAuth) => {
  const isUserExists = await UserModel.findOne({
    email: payload?.email,
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  if (!isUserExists?.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account is registered via Google login. Please use Google login."
    );
  }

  if (!payload?.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong Credentials!");
  }

  // Prevent login if user is pending or blocked
  if (isUserExists.status === "pending") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your account is under review. Please wait for approval."
    );
  }

  if (isUserExists.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is blocked. Contact support."
    );
  }

  // Update status to active on successful login
  const user = await UserModel.findByIdAndUpdate(
    isUserExists._id,
    { status: "active" },
    { new: true }
  );

  return user;
};

/**
 * Login or register user via external providers (e.g. Google)
 */
const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
  const isUserExists = await UserModel.findOne({ email: payload?.email });

  if (!isUserExists) {
    // Determine user status for new provider accounts
    const activeRoles = ["customer", "admin", "super-admin"];
    const role = payload.role || "customer";
    const status = activeRoles.includes(role) ? "active" : "pending";

    const result = await UserModel.create({ ...payload, role, status });

    const jwtPayload = {
      userId: result._id,
      email: result.email,
      role: result.role,
    };

    const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
      expiresIn: "24h",
    });

    return {
      user: result,
      accessToken: token,
    };
  }

  // Check existing user’s status before allowing login
  if (isUserExists.status === "pending") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your account is under review. Please wait for approval."
    );
  }

  if (isUserExists.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is blocked. Contact support."
    );
  }

  const user = await UserModel.findByIdAndUpdate(
    isUserExists._id,
    { status: "active" },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found after update");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "24h",
  });

  return {
    user,
    accessToken: token,
  };
};

/**
 * Logout user and mark as inactive
 */
const logoutUserFromDB = async (id: string) => {
  await UserModel.findByIdAndUpdate(id, { status: "inactive" }, { new: true });
  return {};
};

/**
 * Get current user info using decoded JWT
 */
const getMe = async (decodedUser: JwtPayload) => {
  const me = await UserModel.findById(decodedUser.userId).select("-password");

  if (!me) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return me;
};

export const AuthServices = {
  registerUserOnDB,
  loginUserFromDB,
  logoutUserFromDB,
  loginUserUsingProviderFromDB,
  getMe,
};
