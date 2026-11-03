import axios from 'axios';
import { logger } from '../utils/logger';

export class SmsService {
  private static readonly TEXT_LK_URL = 'https://app.text.lk/api/v3/sms/send';

  /**
   * Normalizes any Sri Lankan phone number format to 947XXXXXXXX
   * Handles: 0783130967, +94783130967, 94783130967, 783130967
   */
  static normalizePhone(phone: string): string {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '94' + cleaned.substring(1);
    } else if (cleaned.length === 9) {
      cleaned = '94' + cleaned;
    }
    return cleaned;
  }

  /**
   * Send single SMS via Text.lk API v3
   */
  static async sendSms(to: string, message: string) {
    const apiToken = process.env.TEXT_LK_API_TOKEN || process.env.TEXT_LK_API_KEY;
    const senderId = process.env.TEXT_LK_SENDER_ID || 'MaskyProd';
    const recipient = this.normalizePhone(to);

    if (!apiToken) {
      logger.info(`[SmsService:Mock] To: ${recipient} | Sender: ${senderId} | Message: ${message}`);
      return { success: true, mocked: true, recipient, message };
    }

    try {
      const response = await axios.post(
        this.TEXT_LK_URL,
        {
          recipient,
          sender_id: senderId,
          type: 'plain',
          message,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      logger.info(`[SmsService:Text.lk] SMS sent successfully to ${recipient}`);
      return {
        success: true,
        providerResponse: response.data,
      };
    } catch (error: any) {
      logger.error(`[SmsService:Text.lk] Failed to send SMS to ${recipient}:`, error?.response?.data || error.message);
      throw new Error(`Text.lk SMS dispatch failed: ${error?.response?.data?.message || error.message}`);
    }
  }

  /**
   * Send bulk SMS via Text.lk API v3
   */
  static async sendBulkSms(numbers: string[], message: string) {
    const apiToken = process.env.TEXT_LK_API_TOKEN || process.env.TEXT_LK_API_KEY;
    const senderId = process.env.TEXT_LK_SENDER_ID || 'MaskyProd';
    const normalizedRecipients = numbers.map(n => this.normalizePhone(n)).join(',');

    if (!apiToken) {
      logger.info(`[SmsService:MockBulk] To: ${normalizedRecipients} (${numbers.length}) | Message: ${message}`);
      return { success: true, sentCount: numbers.length, failedCount: 0, mocked: true };
    }

    try {
      const response = await axios.post(
        this.TEXT_LK_URL,
        {
          recipient: normalizedRecipients,
          sender_id: senderId,
          type: 'plain',
          message,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 15000,
        }
      );

      logger.info(`[SmsService:Text.lk] Bulk SMS sent to ${numbers.length} numbers`);
      return {
        success: true,
        sentCount: numbers.length,
        failedCount: 0,
        providerResponse: response.data,
      };
    } catch (error: any) {
      logger.error(`[SmsService:Text.lk] Bulk SMS dispatch failed:`, error?.response?.data || error.message);
      throw new Error(`Text.lk bulk SMS dispatch failed: ${error?.response?.data?.message || error.message}`);
    }
  }

  /**
   * Official Masky Product SMS Templates
   */
  static templates = {
    otp: (code: string) =>
      `Your Masky Product verification code is: ${code}. Valid for 5 minutes. Cultivating pure natural wellness.`,

    orderConfirmation: (orderNumber: string, total: number) =>
      `Thank you for ordering with Masky Product! Your order #${orderNumber} (Rs. ${total.toLocaleString()}) has been received and is being prepared with care.`,

    orderDispatched: (orderNumber: string, trackingNumber?: string, courier?: string) =>
      `Your Masky Product order #${orderNumber} has been dispatched${trackingNumber ? ` via ${courier || 'Courier'} (Waybill: ${trackingNumber})` : ''}. Fresh gourmet harvest arriving soon!`,

    orderDelivered: (orderNumber: string) =>
      `Your Masky Product order #${orderNumber} has been delivered. Thank you for choosing organic natural nutrition!`,

    expiryWarning: (productTitle: string, daysLeft: number) =>
      `[Masky Product Alert] Product batch "${productTitle}" expires in ${daysLeft} days. Please review shelf-life inventory.`,
  };
}

