// API service for URL shortening functionality

import {
  API_CONFIG,
  getEndpointDefinition,
  buildEndpointUrl,
  URL_SHORTENER_ENDPOINTS,
} from './api-config';

export interface ShortenUrlRequest {
  url: string;
  lifetime: number;
  length: number;
}

export interface ShortenUrlResponse {
  url: string;
}

export interface UrlStatus {
  url: string;
  lifetime: number | null;
  registered: string;
  modified: string;
  expires_at: string;
  expires_in: number;
  expired: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Re-export configuration for external use
export { API_CONFIG } from './api-config';

// Helper function to extract code from URL
const extractCodeFromUrl = (url: string): string => {
  // Validate input first
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    throw new Error('URL cannot be empty or null');
  }

  try {
    // Handle different URL formats:
    // http://localhost:8010/d/3B1XYz -> 3B1XYz
    // https://turl.co/abc123 -> abc123
    // http://localhost:8010/3B1XYz -> 3B1XYz

    const urlObj = new URL(url.trim());
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);

    if (pathParts.length === 0) {
      throw new Error('No path found in URL');
    }

    // Get the last meaningful part of the path
    const code = pathParts[pathParts.length - 1];

    if (!code || code.length === 0) {
      throw new Error('No code found in URL path');
    }

    return code;
  } catch (error) {
    console.error('Error extracting code from URL:', url, error);
    throw new Error(`Invalid URL format: ${url}`);
  }
};

// Helper function to transform lifetime values
const transformLifetime = (lifetime: string): number | null => {
  if (lifetime === 'forever') {
    return null; // Forever should be converted to null
  }

  if (lifetime === '365') {
    return 365; // 1 year is already converted to 365 days
  }

  const days = parseInt(lifetime);
  return isNaN(days) ? 30 : days; // Default to 30 days if invalid
};

// Helper function to transform length values
const transformLength = (length: string): number => {
  const len = parseInt(length);
  return isNaN(len) || len <= 0 ? 6 : len; // Default to 6 characters if invalid
};

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // endpoint is already a full URL from buildEndpointUrl
    const url = endpoint;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  /**
   * Shorten a URL with the specified lifetime and length
   * @param url - The original URL to shorten
   * @param lifetime - The lifetime option ('1', '7', '30', '365', 'forever')
   * @param length - The desired length of the shortened URL
   * @returns Promise<ShortenUrlResponse>
   */
  async shortenUrl(
    url: string,
    lifetime: string,
    length: string
  ): Promise<ShortenUrlResponse> {
    const payload: ShortenUrlRequest = {
      url,
      lifetime: transformLifetime(lifetime),
      length: transformLength(length),
    };

    const endpoint = buildEndpointUrl(getEndpointDefinition('shorten'));
    return this.request<ShortenUrlResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Check the status of a shortened URL
   * @param shortUrl - The shortened URL to check
   * @returns Promise<UrlStatus>
   */
  async checkUrlStatus(shortUrl: string): Promise<UrlStatus> {
    const code = extractCodeFromUrl(shortUrl);
    const endpoint = buildEndpointUrl(getEndpointDefinition('checkStatus'), code);
    return this.request<UrlStatus>(endpoint);
  }

  /**
   * Extend the lifetime of a shortened URL
   * @param code - The code of the shortened URL
   * @param newLifetime - The new lifetime option
   * @returns Promise<UrlStatus>
   */
  async extendUrlLifetime(code: string, newLifetime: string): Promise<UrlStatus> {
    const payload = {
      lifetime: transformLifetime(newLifetime),
    };

    const endpoint = buildEndpointUrl(getEndpointDefinition('extendLifetime'), code);
    return this.request<UrlStatus>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }
}

// Export utility functions
export { extractCodeFromUrl };

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
