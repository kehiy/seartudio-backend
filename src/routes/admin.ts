import { Router } from 'express';

import {
    activateStudio,
    getActiveStudios,
    getAllStudios,
    getDeactiveStudios,
    promoteStudio,
    studioVerification,
    AddAdmin,
    removeAdmin
} from '../controllers/adminController';

import { handlerAsync } from 'utils/handler';
import { authenticateAdmin } from 'middlewares/adminAuth';

const router = Router();


router.post('/activateStudio', authenticateAdmin, handlerAsync(activateStudio));
router.post('/promoteStudio', authenticateAdmin, handlerAsync(promoteStudio));
router.post('/studioVerification', authenticateAdmin, handlerAsync(studioVerification));
router.get('/getActiveStudios', authenticateAdmin, handlerAsync(getActiveStudios));
router.get('/getAllStudios', authenticateAdmin, handlerAsync(getAllStudios));
router.get('/getDeactiveStudios', authenticateAdmin, handlerAsync(getDeactiveStudios));
router.post("/addAdmin", AddAdmin);
router.delete("/removeAdmin", removeAdmin);

export default router;
