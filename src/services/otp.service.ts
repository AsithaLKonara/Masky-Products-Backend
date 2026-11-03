import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { SmsService } from './sms.service';

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export const otpService = {
  /**
   * Generates a 6-digit OTP, stores it in Redis against the phone number,
   * and sends it via the Text.lk SMS gateway (falls back to mock if API key missing).
   */
  async sendOtp(phone: string): Promise<void> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Redis with expiry
    const redisKey = `otp:${phone}`;
    await redisClient.set(redisKey, otp, 'EX', OTP_EXPIRY_SECONDS);
    
    const message = SmsService.templates.otp(otp);
    
    try {
      await SmsService.sendSms(phone, message);
      logger.info(`[OTP] Sent Masky Product OTP to ${phone} via Text.lk`);
    } catch (err) {
      logger.warn(`[OTP] Failed to send SMS via Text.lk gateway, falling back to mock:`, err);
      console.log(`\n\n=== MOCK SMS (Text.lk) ===\nTo: ${phone}\nOTP: ${otp}\nMessage: ${message}\n==========================\n\n`);
    }
  },

  /**
   * Verifies the provided OTP against the stored one in Redis.
   */
  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const redisKey = `otp:${phone}`;
    const storedOtp = await redisClient.get(redisKey);
    
    if (!storedOtp) {
      throw new Error('OTP has expired or was not requested');
    }
    
    if (storedOtp !== otp) {
      throw new Error('Invalid OTP');
    }
    
    // OTP verified successfully, remove it so it can't be reused
    await redisClient.del(redisKey);
    return true;
  }
};
