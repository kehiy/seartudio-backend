import { Router } from 'express';
import { addNewsLetter } from '../controllers/newsLetterController';
import { handlerAsync } from 'utils/handler';

const router = Router();


router.post('/', addNewsLetter);


export default router;
