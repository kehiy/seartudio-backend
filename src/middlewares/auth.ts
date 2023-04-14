import { Request, Response, NextFunction } from 'express';
//
import { Router } from 'express';
import DB from '../databases';
import ClientDto from '../dto/studioDto';

const Client = DB.Client;

const authRouter = Router();

export const authenticated = authRouter.use(async (req: any, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['api-key'];
    if (!apiKey) return res.status(401).json({ message: 'Unauthorized' });

    const client = await Client.findOne({ where: { apiKey: apiKey } });
    if (!client) return res.status(401).json({ message: 'Unauthorized' });

    req.client = new ClientDto(client);
    next();
  } catch (err) {
    next(err);
  }
});
