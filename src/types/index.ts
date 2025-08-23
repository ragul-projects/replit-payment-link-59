// Global type definitions for the application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'developer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  customerName: string;
  email?: string;
  qrCode: string;
  upiLink: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  expiresAt: string;
  customerPhone?: string;
  description?: string;
}

export interface CreatePaymentRequest {
  customerName: string;
  email?: string;
  amount: number;
  customerPhone?: string;
  description?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  description?: string;
  environment: 'production' | 'development' | 'staging';
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  description?: string;
  environment: 'production' | 'development' | 'staging';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  permissions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  sessionTimeout: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
}