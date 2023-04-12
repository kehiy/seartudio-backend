import { apiResponse } from 'utils/apiRespones';
import DB from '../databases';
import messageEnum from 'enums/messageEnum';

const Newsletter = DB.Newsletter;

export const addNewsLetter = async (req, res) => {
  const { email } = req.body;
  const newData = await Newsletter.create({ email });
  return apiResponse(res, 201, messageEnum.created_201, { newData });
};
