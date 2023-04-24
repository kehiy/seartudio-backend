import { Router } from 'express';
import { checkExpier } from '../cron/expierDate';
import { checkPromotExpier } from '../cron/promotExpire';
import { handlerAsync } from 'utils/handler';

const router = Router();


router.patch('/checkExpier', handlerAsync(checkExpier));
router.patch('/checkPromotExpier', handlerAsync(checkPromotExpier));


export default router;
