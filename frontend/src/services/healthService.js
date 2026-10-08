import apiClient, { requireEndpoint } from './apiClient';
import { apiConfig } from './config';

export async function checkBackendHealth() {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.health,
    'Backend health check',
    'VITE_API_HEALTH_ENDPOINT',
  );
  const response = await apiClient.get(endpoint);
  return response.data;
}
