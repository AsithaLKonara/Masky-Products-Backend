import { Request, Response, NextFunction } from "express";
import { multiChannelService } from "../services/multiChannel.service";
import { AppError } from "../middlewares/errorHandler";

export class MultiChannelController {
  // GET /api/v1/channels
  static async getAllChannels(req: Request, res: Response, next: NextFunction) {
    try {
      const channels = await multiChannelService.getChannels();
      res.status(200).json({
        status: "success",
        data: channels,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/channels/stats
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await multiChannelService.getChannelStats();
      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/channels/logs
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const logs = await multiChannelService.getSyncLogs(limit);
      res.status(200).json({
        status: "success",
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/channels/:channelId/connect
  static async connectChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = req.params.channelId as string;
      const { credentials, syncSettings, status } = req.body;

      const updated = await multiChannelService.updateChannelConfig(channelId, {
        credentials,
        syncSettings,
        status,
      });

      res.status(200).json({
        status: "success",
        message: `${updated.name} configuration saved successfully.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/channels/:channelId/disconnect
  static async disconnectChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = req.params.channelId as string;
      const updated = await multiChannelService.disconnectChannel(channelId);

      res.status(200).json({
        status: "success",
        message: `${updated.name} disconnected.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/channels/:channelId/sync
  static async syncChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = req.params.channelId as string;
      const { action = "all" } = req.body;

      const result = await multiChannelService.syncChannel(channelId, action);

      res.status(200).json({
        status: "success",
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/channels/webhooks/:channel
  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const channel = String(req.params.channel || "unknown");
      const payload = req.body;

      // Log webhook reception
      await multiChannelService.addSyncLog({
        channelId: channel,
        channelName: channel.toUpperCase(),
        action: "WEBHOOK_EVENT",
        status: "SUCCESS",
        message: `Inbound webhook received from ${channel.toUpperCase()}: ${payload.eventType || "Notification"}`,
        itemsProcessed: 1,
      });

      res.status(200).json({
        status: "success",
        message: "Webhook processed and queued.",
      });
    } catch (error) {
      next(error);
    }
  }
}
