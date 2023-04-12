import { apiResponse } from 'utils/apiRespones';
import DB from '../databases';
import { Request, Response } from 'express';
import messageEnum from 'enums/messageEnum';

const Newsletter = DB.Newsletter;

export const addNewsLetter = async (req : Request, res:Response) => {
  const {email} = req.body;
  await Newsletter.create({email});
  return apiResponse(res,201,messageEnum.created_201,{email});
};
