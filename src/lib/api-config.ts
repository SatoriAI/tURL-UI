// API Endpoint Configuration
// This file centralizes all API endpoint definitions for easy management

export interface EndpointDefinition {
  path: string | ((...args: any[]) => string);
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
}

export interface EndpointGroup {
  [key: string]: EndpointDefinition;
}

// Environment-specific API configuration
const getApiBaseUrl = (): string => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return 'http://localhost:8010/';
};

// Base API configuration
export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
};

// URL Shortener API Endpoints
export const URL_SHORTENER_ENDPOINTS: EndpointGroup = {
  // Core URL operations
  shorten: {
    path: 'encode',
    method: 'POST',
    description: 'Shorten a URL with custom lifetime and length',
  },

  checkStatus: {
    path: (code: string) => `info/${code}`,
    method: 'GET',
    description: 'Check the status of a shortened URL',
  },

  extendLifetime: {
    path: (code: string) => `extend/${code}`,
    method: 'PATCH',
    description: 'Extend the lifetime of a shortened URL',
  },

  // Future endpoints - uncomment and modify as needed
  /*
  delete: {
    path: (urlId: string) => `urls/${urlId}`,
    method: 'DELETE',
    description: 'Delete a shortened URL',
  },

  analytics: {
    path: (urlId: string) => `urls/${urlId}/analytics`,
    method: 'GET',
    description: 'Get analytics for a shortened URL',
  },

  bulkShorten: {
    path: 'bulk/shorten',
    method: 'POST',
    description: 'Shorten multiple URLs at once',
  },

  list: {
    path: 'urls',
    method: 'GET',
    description: 'List all shortened URLs for the user',
  },

  stats: {
    path: 'stats',
    method: 'GET',
    description: 'Get global statistics',
  },

  // User management endpoints
  userProfile: {
    path: 'user/profile',
    method: 'GET',
    description: 'Get user profile information',
  },

  userUrls: {
    path: 'user/urls',
    method: 'GET',
    description: 'Get all URLs created by the user',
  },
  */
};

// Helper function to build full endpoint URL
export const buildEndpointUrl = (
  definition: EndpointDefinition,
  ...args: any[]
): string => {
  const basePath = typeof definition.path === 'function'
    ? definition.path(...args)
    : definition.path;

  // Build the full URL with baseUrl and endpoint path
  return `${API_CONFIG.baseUrl}${basePath}`;
};

// Environment-specific overrides (for different deployment environments)
export const ENVIRONMENT_OVERRIDES: Record<string, Partial<EndpointGroup>> = {
  development: {
    // Development-specific endpoint overrides
    // shorten: { path: 'dev/shorten', method: 'POST', description: 'Dev shorten endpoint' },
  },

  staging: {
    // Staging-specific endpoint overrides
    // shorten: { path: 'staging/shorten', method: 'POST', description: 'Staging shorten endpoint' },
  },

  production: {
    // Production-specific endpoint overrides
    // shorten: { path: 'prod/shorten', method: 'POST', description: 'Prod shorten endpoint' },
  },
};

// Current environment detection
export const getCurrentEnvironment = (): string => {
  if (import.meta.env.PROD) return 'production';
  if (import.meta.env.DEV) return 'development';
  return 'development'; // fallback
};

// Get environment-specific endpoint definition
export const getEndpointDefinition = (
  endpointName: keyof typeof URL_SHORTENER_ENDPOINTS,
  environment?: string
): EndpointDefinition => {
  const env = environment || getCurrentEnvironment();
  const overrides = ENVIRONMENT_OVERRIDES[env];

  if (overrides && overrides[endpointName]) {
    return overrides[endpointName]!;
  }

  return URL_SHORTENER_ENDPOINTS[endpointName];
};

// Export commonly used endpoint builders for convenience
export const endpoints = {
  shorten: () => buildEndpointUrl(URL_SHORTENER_ENDPOINTS.shorten),
  checkStatus: (urlId: string) => buildEndpointUrl(URL_SHORTENER_ENDPOINTS.checkStatus, urlId),
  extendLifetime: (urlId: string) => buildEndpointUrl(URL_SHORTENER_ENDPOINTS.extendLifetime, urlId),
};
