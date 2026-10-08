import apiClient, { requireEndpoint } from './apiClient';
import { apiConfig } from './config';

export async function analyzeSkillGap(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.careerSkillGap,
    'Skill-gap analysis',
    'VITE_API_CAREER_SKILL_GAP_ENDPOINT',
  );
  const backendPayload = {
    domain: payload.domainInterest
  };
  const response = await apiClient.post(endpoint, backendPayload);
  return response.data;
}

export async function generateInterviewPrep(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.careerInterview,
    'Interview preparation',
    'VITE_API_CAREER_INTERVIEW_ENDPOINT',
  );
  const backendPayload = {
    domain: payload.domainInterest
  };
  const response = await apiClient.post(endpoint, backendPayload);
  return response.data;
}
