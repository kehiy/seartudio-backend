import { Request, Response, NextFunction } from 'express';
import messageEnum from 'enums/messageEnum';
import { apiResponse } from 'utils/apiRespones';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import DB from '../databases/index';


const authRouter = Router();

export const authenticateAdmin = authRouter.use(async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) return apiResponse(res, 401, messageEnum.err_unauthorized);
        const token = authHeader
        let decodedToken = null;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) { }

        if (!decodedToken) {
            return apiResponse(res, 401, messageEnum.err_unauthorized);
        }
        if (decodedToken.admin === undefined) {
            return apiResponse(res, 403, messageEnum.err_forbidden);
        } else if (decodedToken.admin.role === 'admin') {
            const admin = decodedToken.admin;
            req.admin = admin;
        }
        next();
    } catch (err) {
        next(err);
    }
});
