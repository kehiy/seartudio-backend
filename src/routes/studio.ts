import { Router } from 'express';
import { addStudio } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
import { studioValidate, studioValidateErr } from '../validators/newStudioValidator';
const router = Router();


router.post('/add', studioValidate(), studioValidateErr, handlerAsync(addStudio));


export default router;
