import { Router } from 'express';
import { checkExpier } from '../cron/expierDate';
import { handlerAsync } from 'utils/handler';

const router = Router();


router.patch('/checkExpier', handlerAsync(checkExpier));


export default router;
