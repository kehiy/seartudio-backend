import { Router } from 'express';
import { addNewsLetter } from '../controllers/newsLetterController';

const router = Router();


router.post('/', addNewsLetter);


export default router;
