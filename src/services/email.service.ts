import axios from 'axios';
import { logger } from '../utils/logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static readonly RESEND_API_URL = 'https://api.resend.com/emails';

  /**
   * Dispatches email via Resend API v1
   */
  static async sendEmail(options: EmailOptions) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = options.from || process.env.RESEND_FROM_EMAIL || 'Masky Product <orders@masky.space>';
    const to = Array.isArray(options.to) ? options.to : [options.to];

    if (!apiKey) {
      logger.info(`[EmailService:MockResend] To: ${to.join(', ')} | Subject: ${options.subject}`);
      return { success: true, mocked: true, id: `mock-${Date.now()}` };
    }

    try {
      const response = await axios.post(
        this.RESEND_API_URL,
        {
          from,
          to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 12000,
        }
      );

      logger.info(`[EmailService:Resend] Email delivered to ${to.join(', ')} (ID: ${response.data?.id})`);
      return {
        success: true,
        id: response.data?.id,
        providerResponse: response.data,
      };
    } catch (error: any) {
      logger.error(`[EmailService:Resend] Failed to dispatch email:`, error?.response?.data || error.message);
      throw new Error(`Resend API dispatch failed: ${error?.response?.data?.message || error.message}`);
    }
  }

  static getFrontendUrl(): string {
    if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost')) {
      return process.env.FRONTEND_URL.replace(/\/$/, '');
    }
    if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
      return 'https://masky-products-frontend-production.up.railway.app';
    }
    return (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  }

  static getLogoUrl(): string {
    const publicUrl = process.env.FRONTEND_URL?.startsWith('https://')
      ? process.env.FRONTEND_URL.replace(/\/$/, '')
      : 'https://masky-products-frontend-production.up.railway.app';
    return `${publicUrl}/logo/VCFB%20VFC.png`;
  }

  /**
   * Masky Product Brand Styled Email Templates (Earth-tone luxury palette)
   */
  static templates = {
    /**
     * Order Confirmation Email
     */
    orderConfirmation(data: {
      orderNumber: string;
      customerName: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      total: number;
      shippingAddress?: string;
    }) {
      const frontendUrl = EmailService.getFrontendUrl();
      const logoUrl = EmailService.getLogoUrl();
      const itemsHtml = data.items
        .map(
          (item) => `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #DCDCCB; color: #203C2B; font-size: 14px;">
                <strong>${item.name}</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #DCDCCB; color: #62695A; font-size: 14px; text-align: center;">
                x${item.quantity}
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #DCDCCB; color: #203C2B; font-size: 14px; text-align: right; font-family: monospace; font-weight: bold;">
                Rs. ${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          `
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF6E4; margin: 0; padding: 24px; color: #203C2B; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #DCDCCB; overflow: hidden; box-shadow: 0 4px 20px rgba(32,60,43,0.06); }
            .header { background-color: #203C2B; padding: 36px 32px; text-align: center; }
            .logo-img { display: block; margin: 0 auto 12px auto; max-width: 90px; height: auto; border: 0; }
            .subtitle { color: #DCDCCB; font-size: 12px; margin-top: 6px; letter-spacing: 1px; text-transform: uppercase; }
            .content { padding: 36px 32px; }
            .order-badge { background-color: #FEF6E4; border: 1px solid #DCDCCB; border-radius: 12px; padding: 16px; margin: 24px 0; display: flex; justify-content: space-between; }
            .total-row { padding-top: 16px; font-size: 18px; font-weight: bold; color: #203C2B; text-align: right; }
            .footer { background-color: #FAF9F5; padding: 24px 32px; text-align: center; font-size: 12px; color: #62695A; border-top: 1px solid #DCDCCB; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Masky Product" class="logo-img" width="90" />
              </a>
              <p class="subtitle">Artisan & Pure Organic Mushroom Harvests</p>
            </div>
            <div class="content">
              <h2 style="font-size: 20px; color: #203C2B; margin-top: 0;">Order Confirmed #${data.orderNumber}</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #555E4E;">
                Dear ${data.customerName || 'Valued Customer'},<br/>
                Thank you for your order with Masky Product. We have safely received your order and our artisan team is preparing your harvested mushroom products with utmost care.
              </p>

              <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <thead>
                  <tr style="border-bottom: 2px solid #203C2B; text-align: left;">
                    <th style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #71865B;">Harvest Item</th>
                    <th style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #71865B; text-align: center;">Qty</th>
                    <th style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #71865B; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total-row">
                Total Amount: Rs. ${data.total.toLocaleString()}
              </div>

              ${data.shippingAddress ? `
                <div style="margin-top: 24px; padding: 16px; background-color: #FAF9F5; border-radius: 12px; border: 1px solid #DCDCCB;">
                  <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #71865B; display: block; margin-bottom: 6px;">Delivery Destination</strong>
                  <span style="font-size: 13px; color: #203C2B; line-height: 1.5;">${data.shippingAddress}</span>
                </div>
              ` : ''}

              <div style="margin-top: 32px; text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order" style="display: inline-block; background-color: #203C2B; color: #FFFCF4; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                  Track Order Online
                </a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">Masky Product Sri Lanka &bull; Pure Nutrition, Certified Purity</p>
              <p style="margin: 4px 0 0 0;">Inquiries: maskyproduct@gmail.com | WhatsApp: +94 78 313 0967</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: `Order Confirmed #${data.orderNumber} — Masky Product`,
        html,
        text: `Thank you for your order #${data.orderNumber} with Masky Product! Total: Rs. ${data.total}. We are preparing your mushroom harvest.`
      };
    },

    /**
     * Order Dispatched Notification Email
     */
    orderDispatched(data: {
      orderNumber: string;
      customerName: string;
      courierName?: string;
      trackingNumber?: string;
    }) {
      const frontendUrl = EmailService.getFrontendUrl();
      const logoUrl = EmailService.getLogoUrl();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF6E4; margin: 0; padding: 24px; color: #203C2B; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #DCDCCB; overflow: hidden; box-shadow: 0 4px 20px rgba(32,60,43,0.06); }
            .header { background-color: #203C2B; padding: 36px 32px; text-align: center; }
            .logo-img { display: block; margin: 0 auto 12px auto; max-width: 90px; height: auto; border: 0; }
            .subtitle { color: #DCDCCB; font-size: 12px; margin-top: 6px; letter-spacing: 1px; text-transform: uppercase; }
            .content { padding: 36px 32px; }
            .footer { background-color: #FAF9F5; padding: 24px 32px; text-align: center; font-size: 12px; color: #62695A; border-top: 1px solid #DCDCCB; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Masky Product" class="logo-img" width="90" />
              </a>
              <p class="subtitle">Harvest Order Dispatched</p>
            </div>
            <div class="content">
              <h2 style="font-size: 20px; color: #203C2B; margin-top: 0;">Your Harvest Order #${data.orderNumber} is on the way!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #555E4E;">
                Dear ${data.customerName || 'Customer'},<br/>
                Great news! Your fresh Masky Product harvest has been carefully packed and handed over to our delivery partner.
              </p>

              <div style="background-color: #FAF9F5; border: 1px solid #DCDCCB; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #62695A;"><strong>Courier Partner:</strong> ${data.courierName || 'Local Express Delivery'}</p>
                ${data.trackingNumber ? `<p style="margin: 0; font-size: 13px; color: #203C2B;"><strong>Waybill / Tracking #:</strong> <code style="font-family: monospace; background: #FEF6E4; padding: 2px 6px; border-radius: 4px;">${data.trackingNumber}</code></p>` : ''}
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track-order" style="display: inline-block; background-color: #203C2B; color: #FFFCF4; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Track Delivery
                </a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">Masky Product Sri Lanka &bull; Inquiries: maskyproduct@gmail.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: `Order Dispatched #${data.orderNumber} — Masky Product`,
        html,
        text: `Your Masky Product order #${data.orderNumber} has been dispatched! Track your harvest at /track-order.`
      };
    },

    /**
     * Welcome Customer Email
     */
    welcome(data: { customerName: string; email: string }) {
      const frontendUrl = EmailService.getFrontendUrl();
      const logoUrl = EmailService.getLogoUrl();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF6E4; margin: 0; padding: 24px; color: #203C2B; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #DCDCCB; overflow: hidden; box-shadow: 0 4px 20px rgba(32,60,43,0.06); }
            .header { background-color: #203C2B; padding: 36px 32px; text-align: center; }
            .logo-img { display: block; margin: 0 auto 12px auto; max-width: 90px; height: auto; border: 0; }
            .content { padding: 36px 32px; }
            .footer { background-color: #FAF9F5; padding: 24px 32px; text-align: center; font-size: 12px; color: #62695A; border-top: 1px solid #DCDCCB; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Masky Product" class="logo-img" width="90" />
              </a>
            </div>
            <div class="content">
              <h2 style="font-size: 20px; color: #203C2B; margin-top: 0;">Welcome to Pure Living, ${data.customerName}!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #555E4E;">
                Thank you for creating an account with Masky Product. We cultivate organic Oyster and Abalone mushrooms, dehydrated natural wellness powders, and gourmet mushroom chili pastes.
              </p>
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" style="display: inline-block; background-color: #203C2B; color: #FFFCF4; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Explore Our Harvests
                </a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">Masky Product Sri Lanka &bull; Pure Nutrition, Certified Purity</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: `Welcome to Masky Product — Certified Organic Mushroom Harvests`,
        html,
        text: `Welcome to Masky Product, ${data.customerName}! Explore our harvests at ${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop.`
      };
    },

    /**
     * Private Gazette Welcome Dispatch
     */
    gazetteWelcome(email: string) {
      const frontendUrl = EmailService.getFrontendUrl();
      const logoUrl = EmailService.getLogoUrl();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF6E4; margin: 0; padding: 24px; color: #203C2B; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #DCDCCB; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(32, 60, 43, 0.05); }
            .header { background-color: #203C2B; padding: 40px 32px; text-align: center; }
            .logo-img { display: block; margin: 0 auto 12px auto; max-width: 90px; height: auto; border: 0; }
            .tagline { color: #A8B995; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
            .content { padding: 40px 32px; }
            .feature-box { background-color: #FAF9F5; border-left: 3px solid #71865B; padding: 16px 20px; border-radius: 0 12px 12px 0; margin: 24px 0; }
            .footer { background-color: #FAF9F5; padding: 24px 32px; text-align: center; font-size: 11px; color: #8F9489; border-top: 1px solid #DCDCCB; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="tagline">The Inner Circle</div>
              <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Masky Product" class="logo-img" width="90" />
              </a>
            </div>
            <div class="content">
              <h2 style="font-size: 22px; color: #203C2B; margin-top: 0; font-weight: 700;">Welcome to the Private Gazette</h2>
              <p style="font-size: 14px; line-height: 1.7; color: #555E4E;">
                You have been admitted to our quiet circle of culinary connoisseurs. As a subscriber to the <strong>Masky Private Gazette</strong>, you will receive first-priority access to:
              </p>
              <div class="feature-box">
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; color: #203C2B;">
                  <li><strong>Small-Batch Harvest Alerts:</strong> Seasonal dehydrated Oyster & Abalone harvests before public release.</li>
                  <li><strong>Artisan Recipes & Pairings:</strong> Chef-crafted culinary guides, slow-simmered broths, and mushroom chili preserves.</li>
                  <li><strong>Reserve Pricing:</strong> Private member privileges and free delivery allowances across Sri Lanka.</li>
                </ul>
              </div>
              <p style="font-size: 13px; line-height: 1.6; color: #62695A;">
                Our low-temperature dehydration preserve seals intense umami and natural nutrient profiles without artificial additives.
              </p>
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" style="display: inline-block; background-color: #203C2B; color: #FFFCF4; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">
                  Explore The Reserve
                </a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Masky Product Sri Lanka &bull; maskyproduct@gmail.com &bull; +94 78 313 0967</p>
              <p style="margin: 0;">You received this email because you subscribed to the Private Gazette at masky.space.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: `Welcome to the Masky Private Gazette — Exclusive Reserve Harvests`,
        html,
        text: `Welcome to the Masky Private Gazette! You now receive first-priority access to small-batch dehydrated mushroom harvests, artisanal recipes, and private member perks. Visit ${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop.`
      };
    },

    /**
     * Private Gazette Broadcast Dispatch
     */
    gazetteBroadcast(data: { subject: string; previewText?: string; contentHtml: string }) {
      const frontendUrl = EmailService.getFrontendUrl();
      const logoUrl = EmailService.getLogoUrl();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF6E4; margin: 0; padding: 24px; color: #203C2B; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #DCDCCB; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(32, 60, 43, 0.05); }
            .header { background-color: #203C2B; padding: 36px 32px; text-align: center; }
            .logo-img { display: block; margin: 0 auto 12px auto; max-width: 90px; height: auto; border: 0; }
            .tagline { color: #A8B995; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
            .content { padding: 36px 32px; font-size: 14px; line-height: 1.7; color: #555E4E; }
            .footer { background-color: #FAF9F5; padding: 24px 32px; text-align: center; font-size: 11px; color: #8F9489; border-top: 1px solid #DCDCCB; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="tagline">Private Gazette Dispatch</div>
              <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Masky Product" class="logo-img" width="90" />
              </a>
            </div>
            <div class="content">
              ${data.contentHtml}
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" style="display: inline-block; background-color: #203C2B; color: #FFFCF4; padding: 13px 28px; border-radius: 50px; text-decoration: none; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  View Delicacies
                </a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Masky Product Sri Lanka &bull; maskyproduct@gmail.com &bull; +94 78 313 0967</p>
              <p style="margin: 0;">Sent exclusively to Private Gazette subscribers.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      return {
        subject: data.subject,
        html,
        text: data.previewText || data.subject
      };
    }
  };
}

