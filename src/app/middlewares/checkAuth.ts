import { verifyToken } from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/handleAppError';
import config from '../config';
import { UserModel } from '../modules/user/user.model';

export const checkAuth = (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken = req.cookies.accessToken;
      if (req?.body?.token) {
        accessToken = req.body.token;
      }
      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, 'No Token Received');
      }
      const decodedToken = verifyToken(
        accessToken,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const isUserExist = await UserModel.findOne({ email: decodedToken.email });

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist');
      }
      
      if (!authRole.includes(decodedToken.role)) {
        throw new AppError(403, 'You are not permitted to view this route!!!');
      }

      
      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
