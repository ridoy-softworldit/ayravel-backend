// import { AuthServices } from './auth.service';
// import httpStatus from 'http-status';
// import sendResponse from '../../utils/sendResponse';
// import catchAsync from '../../utils/catchAsync';
// import config from '../../config';
// import { setAuthCookie } from '../../utils/setCookie';
// import { createUserTokens } from '../../utils/createTokens';
// import { TUser } from '../user/user.interface';
// import AppError from '../../errors/handleAppError';
// import { StatusCodes } from 'http-status-codes';
// import { JwtPayload } from 'jsonwebtoken';
// import { userRoles } from '../user/user.const';

// const registerUser = catchAsync(async (req, res) => {
//   const userInfo = {
//     ...req.body,
//     auths: {
//       provider: 'email',
//       providerId: req.body.email,
//     },
//   };

//   const result = await AuthServices.registerUserOnDB(userInfo);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'User has been registered successfully!',
//     data: result,
//   });
// });

// const loginUser = catchAsync(async (req, res) => {
//   const userInfo = req?.body;
//   const result = await AuthServices.loginUserFromDB(userInfo);

//   const tokenInfo = createUserTokens(result as TUser);

//   setAuthCookie(res, tokenInfo);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User Logged in Successfully!',
//     data: result,
//   });
// });

// const loginUserUsingProvider = catchAsync(async (req, res) => {
//   const userInfo = req?.body;
//   const result = await AuthServices.loginUserUsingProviderFromDB(userInfo);

//   sendResponse(
//     res.cookie('accessToken', result?.accessToken, {
//       httpOnly: true,
//       secure: config.node_env === 'production',
//       sameSite: 'none',
//       maxAge: 24 * 60 * 60 * 1000,
//     }),
//     {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'User Logged in Successfully!',
//       data: result?.user,
//     }
//   );
// });

// const logOutUser = catchAsync(async (req, res) => {
//   const userId = req.params.id;
//   const result = await AuthServices.logoutUserFromDB(userId);

//   res.clearCookie('accessToken', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//   });

//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//   });
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User Logged Out Successfully!',
//     data: result,
//   });
// });

// const googleCallbackController = catchAsync(async (req, res) => {
//   let redirectTo = req.query.state ? (req.query.state as string) : '';

//   if (redirectTo.startsWith('/')) {
//     redirectTo = redirectTo.slice(1);
//   }
//   const user = req.user as TUser;

//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
//   }

//   const tokenInfo = createUserTokens(user);

//   setAuthCookie(res, tokenInfo);

//   if (user?.role !== 'customer') {
//     if (redirectTo) {
//       return res.redirect(`${config.FRONTEND_URL}/${redirectTo}`);
//     } else {
//       return res.redirect(`${config.FRONTEND_URL}`);
//     }
//   } else {
//      if (redirectTo) {
//        return res.redirect(`${config.FRONTEND_URL_ADMIN}/${redirectTo}`);
//      } else {
//        return res.redirect(`${config.FRONTEND_URL_ADMIN}`);
//      }
//   }

// });

// const gatMe = catchAsync(async (req, res) => {
//   const decodedUser = req.user;

//   const me = await AuthServices.getMe(decodedUser as JwtPayload);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'Data received Successfully!',
//     data: me,
//   });
// });

// export const AuthController = {
//   registerUser,
//   loginUser,
//   logOutUser,
//   loginUserUsingProvider,
//   googleCallbackController,
//   gatMe,
// };

import httpStatus from "http-status";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/handleAppError";
import catchAsync from "../../utils/catchAsync";
import { createUserTokens } from "../../utils/createTokens";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { TUser } from "../user/user.interface";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
  const userInfo = {
    ...req.body,
    auths: {
      provider: "email",
      providerId: req.body.email,
    },
  };

  const result = await AuthServices.registerUserOnDB(userInfo);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      result.status === "pending"
        ? "Registration successful! Please wait for admin approval."
        : "User has been registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserFromDB(userInfo);

  // If no result returned, respond with unauthorized to avoid null access
  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid credentials or user not found.",
      data: null,
    });
  }

  // Handle pending or blocked users with friendly messages
  if (result.status === "pending") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message:
        "Your account is pending approval. Please wait for admin verification.",
      data: null,
    });
  }

  if (result.status === "blocked") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message:
        "Your account has been blocked. Please contact support or admin.",
      data: null,
    });
  }

  const tokenInfo = createUserTokens(result as TUser);
  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: result,
  });
});

const loginUserUsingProvider = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserUsingProviderFromDB(userInfo);

  // Handle pending or blocked users with friendly messages
  if (result.user.status === "pending") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message:
        "Your account is pending approval. Please wait for admin verification.",
      data: null,
    });
  }

  if (result.user.status === "blocked") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message:
        "Your account has been blocked. Please contact support or admin.",
      data: null,
    });
  }

  sendResponse(
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully!",
      data: result?.user,
    }
  );
});

const logOutUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await AuthServices.logoutUserFromDB(userId);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully!",
    data: result,
  });
});

const googleCallbackController = catchAsync(async (req, res) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";
  if (redirectTo.startsWith("/")) redirectTo = redirectTo.slice(1);

  const user = req.user as TUser;

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Handle pending or blocked status before redirect
  if (user.status === "pending") {
    return res.redirect(`${config.FRONTEND_URL}/pending-approval`);
  }

  if (user.status === "blocked") {
    return res.redirect(`${config.FRONTEND_URL}/account-blocked`);
  }

  const tokenInfo = createUserTokens(user);
  setAuthCookie(res, tokenInfo);

  // Redirect user based on their role
  if (user?.role !== "customer") {
    if (redirectTo) {
      return res.redirect(`${config.FRONTEND_URL}/${redirectTo}`);
    } else {
      return res.redirect(`${config.FRONTEND_URL}`);
    }
  } else {
    if (redirectTo) {
      return res.redirect(`${config.FRONTEND_URL_ADMIN}/${redirectTo}`);
    } else {
      return res.redirect(`${config.FRONTEND_URL_ADMIN}`);
    }
  }
});

const gatMe = catchAsync(async (req, res) => {
  const decodedUser = req.user;
  const me = await AuthServices.getMe(decodedUser as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Data received successfully!",
    data: me,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  logOutUser,
  loginUserUsingProvider,
  googleCallbackController,
  gatMe,
};
