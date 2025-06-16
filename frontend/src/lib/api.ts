const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface EmailAnalysisResult {
  scamProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  redFlags: string[];
  confidence: number;
  analyzedAt: string;
  analysisId: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  suggestions: string[];
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  services: {
    database?: string;
    ai_service?: string;
    memory?: string;
  };
}

class ApiClient {
  private backendURL: string;
  private aiServiceURL: string;
  private token: string | null = null;
  private refresh: string | null = null;

  constructor(backendURL: string, aiServiceURL: string) {
    this.backendURL = backendURL;
    this.aiServiceURL = aiServiceURL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
      this.refresh = localStorage.getItem('refreshToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useAiService = false
  ): Promise<T> {
    const baseURL = useAiService ? this.aiServiceURL : this.backendURL;
    const url = `${baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !useAiService) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const err: any = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        err.status = response.status;
        throw err;
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);
    return response;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    this.setToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);
    return response;
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string; expiresAt: string }> {
    const response = await this.request<{ accessToken: string; refreshToken: string; expiresAt: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refresh }),
    });

    this.setToken(response.accessToken);
    if (response.refreshToken) {
      this.setRefreshToken(response.refreshToken);
    }
    return response;
  }

  // Email analysis methods
  async analyzeEmail(emailData: {
    subject: string;
    body: string;
    sender: string;
    recipient: string;
    headers?: string[];
    urls?: string[];
  }): Promise<EmailAnalysisResult> {
    return this.request<EmailAnalysisResult>('/emails/analyze', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  async bulkAnalyzeEmails(emails: Array<{
    subject: string;
    body: string;
    sender: string;
    recipient: string;
    headers?: string[];
    urls?: string[];
  }>): Promise<EmailAnalysisResult[]> {
    return this.request<EmailAnalysisResult[]>('/emails/bulk-analyze', {
      method: 'POST',
      body: JSON.stringify(emails),
    });
  }

  // Chat methods
  async sendChatMessage(message: string, sessionId?: string, context?: string[]): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, context }),
    });
  }

  // Health check methods
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health');
  }

  async aiServiceHealthCheck(): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/', {}, true);
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  setRefreshToken(token: string): void {
    this.refresh = token;
    if (typeof window !== 'undefined') {
// Import CryptoJS for encryption
// CryptoJS is used to encrypt sensitive data before storing it in localStorage
import CryptoJS from 'crypto-js';

  setRefreshToken(token: string): void {
    this.refresh = token;
    if (typeof window !== 'undefined') {
      const encryptedToken = CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_KEY).toString();
      localStorage.setItem('refreshToken', encryptedToken);
    }
  }
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  clearRefreshToken(): void {
    this.refresh = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refresh;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient(BACKEND_URL, AI_SERVICE_URL);
