import { Router } from 'express';
import { getShortLink } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';


const router = Router();


router.get('/:studioId', handlerAsync(getShortLink));


export default router;
