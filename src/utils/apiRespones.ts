import { Response } from 'express';
import _messageEnum from '../enums/messageEnum';

export const apiResponse = (res: Response, statusCode: number, messageEnum: any, data: any = null) => {
  try {
    return res.status(statusCode).json({
      statusCode,
      message: {
        code: messageEnum?.code ?? null,
        text: messageEnum?.text ?? messageEnum,
      },
      data,
    });
  } catch (error) {
    console.log('Error in apiResponse =', error);
    return res.status(500).json({
      statusCode: 500,
      message: {
        code: _messageEnum.err_500.code,
        text: _messageEnum.err_500.text,
      },
      data: null,
    });
  }
};