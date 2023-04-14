import { Router } from 'express';
import { addStudio } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
// import { newsLetterValidate, emailValidate } from 'validators/newsLetterValidator';
const router = Router();


router.post('/add', handlerAsync(addStudio));


export default router;
