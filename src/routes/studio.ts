import { Router } from 'express';
import { addStudio, studioSignup, updateStudio, updateImage, updateLogo, getStudioDetail, getAllStudios, getMe, frogotPassWord, getLink, updatePassWord, deleteStudio } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';
import { studioValidate, studioValidateErr, signupValidate, updateValidate } from '../validators/newStudioValidator';
import { authenticated } from 'middlewares/auth';

const router = Router();


router.post('/signup', signupValidate(), studioValidateErr, handlerAsync(studioSignup));
router.delete('/delete', authenticated, handlerAsync(deleteStudio));
router.get('/forgotPass', handlerAsync(updatePassWord));
router.patch('/updateLogo', authenticated, handlerAsync(updateLogo));
router.patch('/updateImage', authenticated, handlerAsync(updateImage));
router.patch('/update', authenticated, updateValidate(), studioValidateErr, handlerAsync(updateStudio));
router.post('/add', studioValidate(), studioValidateErr, handlerAsync(addStudio));
router.get('/id/:studioId', handlerAsync(getStudioDetail));
router.get('/passWordForgot', handlerAsync(frogotPassWord));
router.get('/getMe', handlerAsync(getMe));
router.get('/getLink', handlerAsync(getLink));
router.get('/', getAllStudios);


export default router;