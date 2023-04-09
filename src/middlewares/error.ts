import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    const message = err.message;
    const data = err.data ?? null;
    return res.status(500).json({ message: message, data: data });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
