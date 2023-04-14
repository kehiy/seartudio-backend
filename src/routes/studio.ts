import { Router } from 'express';
import { addStudio, studioLogin } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
import { studioValidate, studioValidateErr, loginValidate } from '../validators/newStudioValidator';
const router = Router();


router.post('/add', studioValidate(), studioValidateErr, handlerAsync(addStudio));
router.post('/login', loginValidate(), studioValidateErr, handlerAsync(loginValidate));


export default router;
