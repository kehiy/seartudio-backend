import { Router } from 'express';
import { addNewsLetter } from '../controllers/newsLetterController';
import { handlerAsync } from 'utils/handler';
import { newsLetterValidate, emailValidate } from 'validators/newsLetterValidator';
const router = Router();


router.post('/', emailValidate(), newsLetterValidate, handlerAsync(addNewsLetter));


export default router;
