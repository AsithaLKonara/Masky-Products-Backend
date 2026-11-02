# MASKY Product — Backend (Commerce API & Real-Time Socket Gateway)

> Robust, high-performance Express.js & TypeScript micro-monolith API powering **MASKY Product**, an omnichannel e-commerce enterprise for premium **dehydrated mushroom products**. Serves as the central single source of truth for unified catalog management, bi-directional stock synchronization, order processing, and payment orchestration across **Daraz Sri Lanka**, **eBay Marketplace**, **Amazon Seller Central (SP-API)**, and the **Web Storefront**. Built-in **Socket.IO WebSocket Gateway** with atomic zero-stock checkout prevention.

---

## 🍄 Domain Overview

**MASKY Product** processes, packages, and distributes high-nutrient dehydrated edible and functional mushrooms (such as Oyster Mushrooms, Shiitake, Lion's Mane, King Oyster, Button Mushrooms, Gourmet Seasonings, and Mushroom Powders). 

Because inventory is distributed across third-party marketplaces (Daraz, eBay, Amazon) as well as the direct web storefront, inventory changes must be synchronized in sub-second real-time. This backend guarantees:
1. **Zero Overselling / 0-Stock Prevention**: Whenever inventory drops to 0 on any channel, real-time WebSocket events broadcast immediately to freeze checkout on that SKU across all active storefront sessions.
2. **Atomic Pre-Flight Verification**: Dedicated endpoint `POST /api/v1/checkout/verify-stock` verifies available quantity immediately prior to order confirmation.
3. **Omnichannel Orchestration**: Single unified catalog, centralized order fulfillment pipeline, and automated inventory balancing.

---

## ⚡ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js 22 + Express.js | Core API server & middleware pipeline |
| **Language** | TypeScript (Strict mode) | Type safety, DTO contracts, and refactoring confidence |
| **Database** | PostgreSQL 16+ | ACID-compliant relational data persistence |
| **ORM** | Prisma ORM | Schema management, type-safe queries, migrations, and transactions |
| **Real-Time Engine** | Socket.IO v4 | Low-latency room-based WebSocket gateway |
| **Caching & In-Memory** | Redis | Caching, rate limiting, and session state |
| **Validation** | Zod | Runtime payload and environment validation |
| **Authentication & Security** | JWT (Dual-Token) | HTTP-only Access/Refresh cookies, CSRF protection, RBAC |
| **Task Scheduling** | Node-Cron | Automated audit digests, inventory sync, and backup reminders |

---

## 🏗️ Core Architecture & Subsystems

```mermaid
graph TD
    Client[Storefront / Mobile / Admin] -->|HTTP / REST| API[Express API Gateway]
    Client <-->|WebSockets| SocketServer[Socket.IO Gateway]
    Marketplace[Daraz / eBay / Amazon] -->|Webhooks / Polling| MultiChannel[Multi-Channel Service]
    
    API --> Controller[Route Controllers]
    MultiChannel --> InventoryService[Inventory Service]
    Controller --> Service[Domain Services]
    
    InventoryService -->|Broadcast 0-Stock| SocketServer
    Service --> Prisma[Prisma ORM Client]
    Prisma --> Postgres[(PostgreSQL Database)]
    Service --> Redis[(Redis Cache)]
```

### 1. Real-Time WebSocket Gateway (`src/services/socket.service.ts`)
- Mounted directly onto the Node.js HTTP server.
- **Room Architecture**:
  - `storefront`: Global announcements, catalog updates.
  - `variant:{id}`: Variant-specific stock rooms joined by checkout and product detail pages.
  - `admin:channels`: Real-time audit events, channel status alerts, and multi-channel order ingestion.
- **Broadcast Events**:
  - `stock:updated`: Fired on stock adjustments with SKU, remaining quantity, and stock status.
  - `stock:depleted`: Critical emergency event triggered when stock hits 0 (`zeroStock: true`).
  - `channel:sync_event`: Live audit trail logs pushed directly to the Admin Control Center.
  - `order:ingested`: Marketplace order alerts detailing items, customer, and channel origin.

### 2. Multi-Channel Integration Engine (`src/services/multiChannel.service.ts`)
- **Daraz Sri Lanka & Regional**: Open Platform API integration for category mapping, SKU uploads, and stock allocation.
- **eBay Marketplace**: Inventory & Merchant API integration supporting global listings (`EBAY_US`) with automated currency conversion.
- **Amazon Seller Central (SP-API)**: Selling Partner API connector managing active listings, order ingestion, and inventory feeds.
- **Sync Audit Log**: Structured audit entries tracking action, channel name, status, and affected SKUs.

### 3. Inventory & 0-Stock Guard (`src/services/inventory.service.ts`)
- **Atomic Stock Adjustments**: Database transactions ensuring inventory decrements cannot result in negative quantities.
- **Pre-Checkout Verification**: `POST /api/v1/checkout/verify-stock` parses cart items and validates stock before payment processing.
- **Batch & Shelf-Life Management**: Dehydrated mushroom batches track drying dates, harvest source, and expiration dates.

### 4. Payments, Checkout & Fulfillment
- **Payment Providers**: Cash on Delivery (COD), Koko (BNPL installment gateway), PayHere Credit/Debit, and OnePay.
- **Courier Integration**: Fardar Courier API for automated tracking number generation and waybill dispatch.
- **Loyalty Program**: Tiered customer point earnings, redemption discounts, and wallet balances.

### 5. Security & Governance
- **Double-Submit CSRF**: In-memory and cookie-based CSRF protection on mutating HTTP verbs (`POST`, `PUT`, `DELETE`).
- **Tiered Rate Limiting**: Redis-backed velocity tracking and brute-force prevention on authentication routes.
- **Role-Based Access Control (RBAC)**: 57 permissions enforced via `requirePermission` middleware.

---

## 📡 API Surface (Selected Endpoints)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate admin or customer, issue JWT cookies | Public |
| `GET` | `/api/v1/auth/me` | Fetch active authenticated profile & permissions | User / Admin |
| `GET` | `/api/v1/channels` | List connected marketplace channels (Daraz, eBay, Amazon) | `system:platform_settings` |
| `GET` | `/api/v1/channels/stats` | Aggregate multi-channel revenue, orders, and health | `reports:view_dashboard` |
| `GET` | `/api/v1/channels/logs` | Query sync audit log trail with pagination | `system:platform_settings` |
| `POST` | `/api/v1/channels/:id/connect`| Save API credentials and synchronization rules | `system:platform_settings` |
| `POST` | `/api/v1/channels/sample-order`| Ingest sample marketplace order & trigger stock drop | `orders:create` |
| `POST` | `/api/v1/checkout/verify-stock`| Atomic pre-flight check to prevent 0-stock checkouts | Public (Session) |
| `POST` | `/api/v1/checkout/initiate` | Create order, deduct inventory, initiate gateway | Public (Session) |
| `GET` | `/api/v1/products` | Retrieve catalog of dehydrated mushroom products | Public |
| `GET` | `/api/v1/products/:slug` | Retrieve single product with packaging variant SKUs | Public |
| `POST` | `/api/v1/inventory/adjust` | Manual inventory adjustment with WebSocket broadcast | `inventory:manage` |
| `GET` | `/api/v1/cart` | Retrieve active shopping cart by session or customer ID | Public (Session) |
| `POST` | `/api/v1/cart/items` | Add pack size variant to cart | Public (Session) |
| `POST` | `/api/v1/payments/webhook/:gateway`| Handle async payment confirmation webhooks | Public (Signed) |

---

## 🗄️ Database Models (Prisma ORM)

The relational schema (`prisma/schema.prisma`) includes:
- **`Product`**: Dehydrated mushroom title, slug, description, culinary pairing notes, rehydration ratio, category.
- **`ProductVariant`**: Pack sizes (50g, 100g, 250g, 500g, 1kg), SKU (`MSK-OYST-250G`), price, quantity, stock status.
- **`InventoryBatch`**: Dehydration batch number, moisture content percentage, drying facility, harvest date.
- **`ChannelConfig`**: Marketplace ID (`daraz`, `ebay`, `amazon`), credentials, sync settings, metrics.
- **`SyncLog`**: Action type, status, channel identifier, message, processed items count.
- **`Cart` & `CartItem`**: Guest session ID or authenticated customer ID, variant link, quantity.
- **`Order` & `OrderItem`**: Multi-channel origin identifier, fulfillment status, customer, shipping address.
- **`User` & `Role`**: Identity, hashed credentials, assigned granular permissions.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or v22.x
- **PostgreSQL**: v15 or v16
- **Redis** (optional, recommended for production rate limiting and caching)

### Installation
```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install
```

### Environment Configuration
Create `.env` based on `.env.example`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/masky_products?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Security & Tokens
JWT_ACCESS_SECRET="your-super-secret-access-token-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key"
CSRF_SECRET="your-csrf-token-secret"

# Payment Webhook Secrets
PAYMENT_WEBHOOK_SECRET="masky-webhook-secret"

# Marketplace API Credentials (Optional for local test mode)
DARAZ_APP_KEY="your-daraz-app-key"
DARAZ_APP_SECRET="your-daraz-app-secret"
EBAY_CLIENT_ID="your-ebay-client-id"
EBAY_CLIENT_SECRET="your-ebay-client-secret"
AMAZON_LWA_CLIENT_ID="your-amazon-client-id"
AMAZON_LWA_CLIENT_SECRET="your-amazon-client-secret"
```

### Database Setup & Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Seed dehydrated mushroom catalog, categories, and channels
npx tsx scripts/seed-comprehensive.ts
```

### Running Locally
```bash
# Start development server with hot-reload
npm run dev

# Server will listen on:
# HTTP REST API: http://127.0.0.1:5000/api/v1
# WebSocket Gateway: ws://127.0.0.1:5000
```

### Production Build & Launch
```bash
# Compile TypeScript to dist/
npm run build

# Start production server
node dist/index.js
```

---

## 🧪 Testing & Validation

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run unit and integration tests
npm test
```

---

## 📄 License
Proprietary & Confidential — **MASKY Product** © 2026. All rights reserved.
