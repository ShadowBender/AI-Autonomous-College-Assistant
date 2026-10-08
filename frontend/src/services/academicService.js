import apiClient, { requireEndpoint } from './apiClient';
import { apiConfig } from './config';

export async function askAcademicQuestion(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.qa,
    'Academic Q&A',
    'VITE_API_QA_ENDPOINT',
  );
  // Map the frontend 'question' field to the backend 'query' field
  const backendPayload = {
    query: payload.question
  };
  
  const response = await apiClient.post(endpoint, backendPayload);
  return response.data;
}
