import { Router } from 'express';
import { getClientInfo } from '../controllers/clientController';

const router = Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get client info
 *     parameters:
 *     - name: "api-key"
 *       in: header
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getClientInfo);

//
export default router;
