import { apiResponse } from 'utils/apiRespones';
import DB from '../databases';
import messageEnum from 'enums/messageEnum';

const Newsletter = DB.Newsletter;

export const addNewsLetter = async (req, res) => {
  const { email } = req.body;

  const duplicate = await Newsletter.findOne({ where: { email } });

  if (!duplicate) {
    await Newsletter.create({ email });

    return apiResponse(res, 201, messageEnum.created_201, { email,"msg":"ایمیل شما با موفقیت ثبت شد." });

  } else {
    return apiResponse(res, 400, messageEnum.bad_request, { "msg": "شما قبلا در خبرنامه ثبت نام کرده اید." });
  }
};
