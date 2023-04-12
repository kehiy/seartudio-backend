import { Router } from 'express';
import { addNewsLetter } from '../controllers/newsLetterController';
import { handlerAsync } from 'utils/handler';

const router = Router();


router.post('/', handlerAsync(addNewsLetter));


export default router;
