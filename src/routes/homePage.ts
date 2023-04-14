import { Router } from 'express';
import { getHomePage } from '../controllers/homePageController';
import { handlerAsync } from 'utils/handler';

const router = Router();


router.get('/', handlerAsync(getHomePage));


export default router;
