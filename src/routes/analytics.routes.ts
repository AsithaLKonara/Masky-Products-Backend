import { Router } from 'express';
import { getBusinessOverview, getPublicStats } from '../controllers/analytics.controller';
import { authenticateJWT, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

router.get('/public-stats', getPublicStats);
router.get('/overview', authenticateJWT, requirePermission("reports:view_dashboard"), getBusinessOverview);

export default router;
