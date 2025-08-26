import { SecurityConfig, AuditLog } from '@/types';
import { z } from 'zod';

// Security configuration
export const SECURITY_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordMinLength: 8,
  requireSpecialChars: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// Input validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');

export const passwordSchema = z.string()
  .min(SECURITY_CONFIG.passwordMinLength, `Password must be at least ${SECURITY_CONFIG.passwordMinLength} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const amountSchema = z.number()
  .min(1, 'Minimum amount is ₹1')
  .max(100000, 'Maximum amount is ₹1,00,000')
  .refine((val) => Number.isFinite(val) && val > 0, 'Amount must be a valid positive number');

export const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
  .optional();

// Security utilities
export class SecurityManager {
  private static readonly LOGIN_ATTEMPTS_KEY = 'login_attempts';
  private static readonly LOCKOUT_KEY = 'account_lockout';
  private static readonly SESSION_KEY = 'user_session';

  // Check if account is locked out
  static isAccountLocked(): boolean {
    const lockoutData = localStorage.getItem(this.LOCKOUT_KEY);
    if (!lockoutData) return false;

    const { lockedUntil } = JSON.parse(lockoutData);
    const now = Date.now();
    
    if (now > lockedUntil) {
      localStorage.removeItem(this.LOCKOUT_KEY);
      localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
      return false;
    }
    
    return true;
  }

  // Record failed login attempt
  static recordFailedLogin(): void {
    const attempts = this.getLoginAttempts() + 1;
    localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, attempts.toString());

    if (attempts >= SECURITY_CONFIG.maxLoginAttempts) {
      this.lockAccount();
    }
  }

  // Lock account after max attempts
  private static lockAccount(): void {
    const lockedUntil = Date.now() + SECURITY_CONFIG.lockoutDuration;
    localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify({ lockedUntil }));
  }

  // Get current login attempts
  static getLoginAttempts(): number {
    const attempts = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  // Clear login attempts on successful login
  static clearLoginAttempts(): void {
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    localStorage.removeItem(this.LOCKOUT_KEY);
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"&]/g, (match) => {
        const htmlEntities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return htmlEntities[match] || match;
      })
      .trim()
      .substring(0, 1000); // Limit input length
  }

  // Generate cryptographically secure random string
  static generateSecureToken(length: number = 32): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, (byte) => chars[byte % chars.length]).join('');
    }
    
    // Fallback for environments without crypto API
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Check session validity
  static isSessionValid(): boolean {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return false;

    try {
      const { timestamp, timeout } = JSON.parse(sessionData);
      return Date.now() - timestamp < timeout;
    } catch {
      return false;
    }
  }

  // Create new session
  static createSession(): void {
    const sessionData = {
      timestamp: Date.now(),
      timeout: SECURITY_CONFIG.sessionTimeout,
      token: this.generateSecureToken()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  }

  // Clear session
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Log security events (demo only - would be server-side in production)
  static logSecurityEvent(action: string, success: boolean, details?: Record<string, any>): void {
    // In production, this would be sent to a secure logging service
    const log = {
      id: this.generateSecureToken(16),
      action: this.sanitizeInput(action),
      timestamp: new Date().toISOString(),
      success,
      // Remove sensitive details for client-side logging
      details: details ? { type: details.type || 'auth_event' } : undefined
    };

    // Console log for demo (would be secure server logging in production)
    console.log('Security Event:', log);
  }

  // Get audit logs (demo only - would be from secure server in production)
  static getAuditLogs(): AuditLog[] {
    // In production, this would fetch from secure server endpoint
    return [];
  }

  // Validate file upload
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): boolean {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size exceeds limit');
    }
    
    return true;
  }

  // Rate limiting
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }
}

// Validation helper functions
export const validatePaymentRequest = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    nameSchema.parse(data.customerName);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  if (data.email) {
    try {
      emailSchema.parse(data.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => e.message));
      }
    }
  }

  try {
    amountSchema.parse(Number(data.amount));
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }

  if (data.customerPhone) {
    try {
      phoneSchema.parse(data.customerPhone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => e.message));
      }
    }
  }

  return { isValid: errors.length === 0, errors };
};

export const validateApiKeyRequest = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('API key name must be at least 3 characters');
  }

  if (!data.permissions || !Array.isArray(data.permissions) || data.permissions.length === 0) {
    errors.push('At least one permission must be selected');
  }

  const validPermissions = ['read', 'write', 'delete', 'admin'];
  const invalidPermissions = data.permissions?.filter((p: string) => !validPermissions.includes(p));
  if (invalidPermissions?.length > 0) {
    errors.push(`Invalid permissions: ${invalidPermissions.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};