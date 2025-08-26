// Mock API Key Service
import { ApiKey, CreateApiKeyRequest } from '@/types';

class ApiKeyService {
  private apiKeys: Map<string, ApiKey> = new Map();

  constructor() {
    // Load existing API keys from localStorage
    const stored = localStorage.getItem('upi_api_keys');
    if (stored) {
      try {
        const keysArray = JSON.parse(stored);
        this.apiKeys = new Map(keysArray);
      } catch (error) {
        console.error('Failed to load stored API keys:', error);
      }
    } else {
      // Initialize with sample keys
      this.initializeSampleKeys();
    }
  }

  private initializeSampleKeys() {
    const sampleKeys: ApiKey[] = [
      {
        id: "1",
        name: "Production API",
        key: "sk_live_51H7cK2SjPMbNpKhHnVkR3X0Y9B8QwA2dF5Gg6Hh1jJ8kK9lL0mM",
        permissions: ["read", "write"],
        createdAt: "2024-01-15T10:30:00Z",
        lastUsed: "2024-01-20T14:22:00Z",
        isActive: true,
        description: "Main production API key for live transactions",
        environment: "production"
      },
      {
        id: "2", 
        name: "Development API",
        key: "sk_test_51H7cK2SjPMbNpKhAaXxBbYy3CcD4eE5fF6Gg7Hh8Ii9Jj0Kk1Ll",
        permissions: ["read"],
        createdAt: "2024-01-10T09:15:00Z",
        isActive: true,
        description: "Development and testing purposes only",
        environment: "development"
      }
    ];

    sampleKeys.forEach(key => this.apiKeys.set(key.id, key));
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      const keysArray = Array.from(this.apiKeys.entries());
      localStorage.setItem('upi_api_keys', JSON.stringify(keysArray));
    } catch (error) {
      console.error('Failed to save API keys:', error);
    }
  }

  private generateApiKey(type: 'live' | 'test' = 'test'): string {
    const prefix = type === 'live' ? 'sk_live_' : 'sk_test_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    // Use crypto API for secure random generation
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(50);
      crypto.getRandomValues(array);
      const random = Array.from(array, (byte) => chars[byte % chars.length]).join('');
      return prefix + random;
    }
    
    // Fallback for environments without crypto API
    const random = Array.from({ length: 50 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return prefix + random;
  }

  async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const id = Date.now().toString();
    const isProduction = request.permissions.includes('write') || request.permissions.includes('admin');
    
    const apiKey: ApiKey = {
      id,
      name: request.name,
      key: this.generateApiKey(isProduction ? 'live' : 'test'),
      permissions: request.permissions,
      createdAt: new Date().toISOString(),
      isActive: true,
      description: request.description,
      environment: request.environment
    };

    this.apiKeys.set(id, apiKey);
    this.saveToStorage();

    return apiKey;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return Array.from(this.apiKeys.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteApiKey(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!this.apiKeys.has(id)) {
      throw new Error('API key not found');
    }

    this.apiKeys.delete(id);
    this.saveToStorage();
  }

  async toggleApiKey(id: string): Promise<ApiKey> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey) {
      throw new Error('API key not found');
    }

    apiKey.isActive = !apiKey.isActive;
    this.apiKeys.set(id, apiKey);
    this.saveToStorage();

    return apiKey;
  }

  async updateLastUsed(id: string): Promise<void> {
    const apiKey = this.apiKeys.get(id);
    if (apiKey) {
      apiKey.lastUsed = new Date().toISOString();
      this.apiKeys.set(id, apiKey);
      this.saveToStorage();
    }
  }
}

export const apiKeyService = new ApiKeyService();