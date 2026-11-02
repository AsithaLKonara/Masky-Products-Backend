import { Router } from "express";
import { MultiChannelController } from "../controllers/multiChannel.controller";
import { authenticateJWT, requireRole } from "../middlewares/auth.middleware";
import { auditLog } from "../middlewares/audit.middleware";

const router = Router();

// Inbound Webhooks (External marketplaces call without session JWT, signed via headers/HMAC)
router.post("/webhooks/:channel", MultiChannelController.handleWebhook);

// Protected Admin / Super Admin Multi-Channel Operations
router.get("/", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), MultiChannelController.getAllChannels);
router.get("/stats", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), MultiChannelController.getStats);
router.get("/logs", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), MultiChannelController.getLogs);

router.post("/:channelId/connect", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), auditLog("MultiChannel", "CONNECT"), MultiChannelController.connectChannel);
router.post("/:channelId/disconnect", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), auditLog("MultiChannel", "DISCONNECT"), MultiChannelController.disconnectChannel);
router.post("/:channelId/sync", authenticateJWT, requireRole("ADMIN", "SUPER_ADMIN"), auditLog("MultiChannel", "SYNC"), MultiChannelController.syncChannel);

export default router;
