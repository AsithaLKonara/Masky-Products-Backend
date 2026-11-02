import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { logger } from "../utils/logger";

export interface StockUpdatePayload {
  variantId: string;
  productId?: string;
  sku?: string;
  quantity: number;
  stockStatus: "instock" | "lowstock" | "outofstock";
  channel?: string;
  branchId?: string;
  reason?: string;
  timestamp: string;
}

export interface ChannelSyncEventPayload {
  channelId: string;
  channelName: string;
  action: string;
  status: "SUCCESS" | "FAILED" | "IN_PROGRESS";
  message: string;
  itemsProcessed?: number;
  timestamp: string;
}

class SocketService {
  private io: SocketIOServer | null = null;

  public init(httpServer: HttpServer): SocketIOServer {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ].filter(Boolean) as string[];

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".up.railway.app") ||
            (process.env.FRONTEND_URL &&
              origin === process.env.FRONTEND_URL.replace("https://", "https://www."))
          ) {
            callback(null, true);
          } else {
            callback(null, true); // Dev-permissive to ensure seamless local testing
          }
        },
        credentials: true,
      },
      pingTimeout: 30000,
      pingInterval: 15000,
    });

    this.io.on("connection", (socket: Socket) => {
      logger.info(`[WebSocket] Client connected: ${socket.id}`);

      // Auto-join default storefront channel room
      socket.join("storefront");

      // Room subscription handlers
      socket.on("join:variant", (variantId: string) => {
        if (variantId) {
          socket.join(`variant:${variantId}`);
          logger.debug(`[WebSocket] ${socket.id} joined variant:${variantId}`);
        }
      });

      socket.on("leave:variant", (variantId: string) => {
        if (variantId) {
          socket.leave(`variant:${variantId}`);
        }
      });

      socket.on("join:admin:channels", () => {
        socket.join("admin:channels");
        logger.debug(`[WebSocket] ${socket.id} joined admin:channels`);
      });

      socket.on("leave:admin:channels", () => {
        socket.leave("admin:channels");
      });

      socket.on("disconnect", (reason) => {
        logger.info(`[WebSocket] Client disconnected: ${socket.id} (${reason})`);
      });
    });

    logger.info("[WebSocket] Socket.IO server initialized successfully.");
    return this.io;
  }

  public getIO(): SocketIOServer | null {
    return this.io;
  }

  // 1. Real-Time Stock Broadcast
  public broadcastStockUpdate(data: Omit<StockUpdatePayload, "timestamp">) {
    if (!this.io) {
      logger.warn("[WebSocket] Cannot broadcast stock update: Socket.IO not initialized.");
      return;
    }

    const payload: StockUpdatePayload = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // Emit to generic storefront room
    this.io.to("storefront").emit("stock:updated", payload);

    // Emit to targeted variant room for active checkout / product page viewers
    this.io.to(`variant:${data.variantId}`).emit("stock:updated", payload);

    // Emit to admin control center
    this.io.to("admin:channels").emit("stock:updated", payload);

    // If stock dropped to zero or below, broadcast emergency depletion event
    if (payload.quantity <= 0) {
      logger.warn(`[WebSocket] ZERO STOCK ALERT for variant ${data.variantId}. Broadcasting lockout event.`);
      this.io.to("storefront").emit("stock:depleted", {
        ...payload,
        zeroStock: true,
      });
      this.io.to(`variant:${data.variantId}`).emit("stock:depleted", {
        ...payload,
        zeroStock: true,
      });
    }

    logger.info(`[WebSocket] Broadcasted stock update for SKU/Variant ${data.sku || data.variantId}: Qty ${data.quantity} (${payload.stockStatus})`);
  }

  // 2. Real-Time Channel Sync Event Broadcast
  public broadcastChannelSync(data: Omit<ChannelSyncEventPayload, "timestamp">) {
    if (!this.io) return;

    const payload: ChannelSyncEventPayload = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    this.io.to("admin:channels").emit("channel:sync_event", payload);
    logger.info(`[WebSocket] Broadcasted channel sync event for ${data.channelName}: ${data.action} (${data.status})`);
  }

  // 3. Real-Time Marketplace Order Broadcast
  public broadcastOrderIngested(orderNumber: string, channel: string, total: number) {
    if (!this.io) return;

    this.io.to("admin:channels").emit("order:ingested", {
      orderNumber,
      channel,
      total,
      timestamp: new Date().toISOString(),
    });
  }
}

export const socketService = new SocketService();
export default socketService;
