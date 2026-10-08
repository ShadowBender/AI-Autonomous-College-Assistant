import apiClient, { requireEndpoint } from './apiClient';
import { apiConfig } from './config';

export async function generateStudyPlan(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.studyPlan,
    'Study plan generation',
    'VITE_API_STUDY_PLAN_ENDPOINT',
  );
  const backendPayload = {
    subject: payload.subjects ? payload.subjects.join(", ") : "General",
    daily_hours: payload.hoursPerDay,
    exam_date: payload.examDate
  };
  const response = await apiClient.post(endpoint, backendPayload);
  return response.data;
}

export async function updateStudyProgress(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.studyProgress,
    'Adaptive progress update',
    'VITE_API_STUDY_PROGRESS_ENDPOINT',
  );
  const response = await apiClient.post(endpoint, payload);
  return response.data;
}

export async function generateRevisionChecklist(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.revision,
    'Revision checklist generation',
    'VITE_API_REVISION_ENDPOINT',
  );
  const response = await apiClient.post(endpoint, payload);
  return response.data;
}
