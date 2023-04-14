import { Router } from 'express';
import { addStudio, studioSignup } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
import { studioValidate, studioValidateErr, signupValidate } from '../validators/newStudioValidator';
import { authenticated } from 'middlewares/auth';
import { authenticateAdmin } from 'middlewares/adminAuth';
const router = Router();


router.post('/add', studioValidate(), studioValidateErr, handlerAsync(addStudio));
router.post('/signup', signupValidate(), studioValidateErr, studioSignup);


export default router;
