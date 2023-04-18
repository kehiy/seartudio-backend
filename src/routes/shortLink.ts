import { Router } from 'express';
import { getShortLink } from '../controllers/studioController';
import { handlerAsync } from 'utils/handler';


const router = Router();


router.get('/:s', handlerAsync(getShortLink));


export default router;
