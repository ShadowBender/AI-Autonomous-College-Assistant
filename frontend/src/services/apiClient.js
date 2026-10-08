import axios from 'axios';
import { apiConfig } from './config';

const apiClient = axios.create({
  baseURL: apiConfig.baseURL || undefined,
  timeout: apiConfig.timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export class IntegrationNotConfiguredError extends Error {
  constructor(capability, envName) {
    super(`${capability} is not configured yet. Add ${envName} to your .env file using the route exposed by the existing backend.`);
    this.name = 'IntegrationNotConfiguredError';
    this.capability = capability;
    this.envName = envName;
  }
}

export const requireEndpoint = (value, capability, envName) => {
  if (!value) {
    throw new IntegrationNotConfiguredError(capability, envName);
  }
  return value;
};

export const applyPathTemplate = (template, params = {}) => {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replaceAll(`{${key}}`, encodeURIComponent(String(value))),
    template,
  );
};

export const getFriendlyApiError = (error) => {
  if (error instanceof IntegrationNotConfiguredError) return error.message;

  const status = error?.response?.status;
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.response?.data?.error;

  if (backendMessage && typeof backendMessage === 'string') return backendMessage;

  switch (status) {
    case 400:
      return 'The backend rejected the request. Please review the entered information.';
    case 401:
      return 'The backend requires authentication for this request.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested backend resource was not found.';
    case 409:
      return 'The request conflicts with existing backend data.';
    case 422:
      return 'Some fields were not accepted by the backend. Please review them and try again.';
    case 500:
      return 'The backend encountered an error. Please try again later.';
    default:
      if (error?.code === 'ECONNABORTED') return 'The backend request timed out. Please try again.';
      if (error?.message === 'Network Error') return 'Unable to reach the backend. Check the base URL and server status.';
      return 'Something went wrong while contacting the backend.';
  }
};

export default apiClient;
