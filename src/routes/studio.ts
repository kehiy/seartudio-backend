import { Router } from 'express';
import { addStudio, studioSignup, updateStudio, updateImage, updateLogo, getStudioDetail, getAllStudios, getMe } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
import { studioValidate, studioValidateErr, signupValidate, updateValidate } from '../validators/newStudioValidator';
import { authenticated } from 'middlewares/auth';

const router = Router();


router.post('/signup', signupValidate(), studioValidateErr, handlerAsync(studioSignup));
router.patch('/updateLogo', authenticated, handlerAsync(updateLogo));
router.patch('/updateImage', authenticated, handlerAsync(updateImage));
router.patch('/update', authenticated, updateValidate(), studioValidateErr, handlerAsync(updateStudio));
router.post('/add', studioValidate(), studioValidateErr, handlerAsync(addStudio));
router.get('/id/:studioId', handlerAsync(getStudioDetail));
router.get('/getMe', getMe);
router.get('/', getAllStudios);


export default router;