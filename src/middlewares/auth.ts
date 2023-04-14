import { Request, Response, NextFunction } from 'express';
import messageEnum from 'enums/messageEnum';
import { apiResponse } from 'utils/apiRespones';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import DB from '../databases/index';

const Studio = DB.Studio;

const authRouter = Router();

export const authenticated = authRouter.use(async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) return apiResponse(res, 401, messageEnum.err_unauthorized);
    const token = authHeader
    let decodedToken = null;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {}

    if (!decodedToken) {
      return apiResponse(res, 401, messageEnum.err_unauthorized);
    }

    const studio = decodedToken.studioData;
    req.studio = studio;
    next();
  } catch (err) {
    next(err);
  }
});
