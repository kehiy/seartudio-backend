import { apiResponse } from 'utils/apiRespones';
import DB from '../databases';
import { Request, Response } from 'express';

const Newsletter = DB.Newsletter;

export const addNewsLetter = async (req : Request, res:Response) => {
  const {email} = req.body;
  await Newsletter.create({email});
  return apiResponse(res,201,ss,{});
};
