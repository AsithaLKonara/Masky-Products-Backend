import { Router } from 'express';
import * as posController from '../controllers/pos.controller';
import { authenticateJWT, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

// Guard POS endpoints if feature is disabled
router.use((req, res, next) => {
  if (process.env.ENABLE_POS !== "true") {
    return res.status(403).json({
      success: false,
      message: "POS feature is currently disabled in system configuration",
    });
  }
  next();
});

// Sessions
router.post('/sessions/open', authenticateJWT, requirePermission("pos:shift_open_close"), posController.openSession);
router.post('/sessions/close', authenticateJWT, requirePermission("pos:shift_open_close"), posController.closeSession);
router.get('/sessions/current', authenticateJWT, posController.getCurrentSession);
router.get('/sessions/current/expected-closing', authenticateJWT, posController.getExpectedClosing);
router.get('/sessions/summary', authenticateJWT, posController.getSessionSummary);

// Vouchers
router.post('/vouchers/generate', authenticateJWT, requirePermission("pos:sales_mode"), posController.generateVoucher);
router.get('/vouchers/:code', authenticateJWT, posController.validateVoucher);

// Orders
router.post('/orders', authenticateJWT, requirePermission("pos:sales_mode"), posController.processPosOrder);

export default router;
