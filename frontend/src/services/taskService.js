import apiClient, { applyPathTemplate, requireEndpoint } from './apiClient';
import { apiConfig } from './config';

export async function listTasks(params = {}) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.taskList,
    'Task listing',
    'VITE_API_TASKS_LIST_ENDPOINT',
  );
  const response = await apiClient.get(endpoint, { params });
  return response.data;
}

export async function createTask(payload) {
  const endpoint = requireEndpoint(
    apiConfig.endpoints.taskCreate,
    'Task creation',
    'VITE_API_TASKS_CREATE_ENDPOINT',
  );
  const response = await apiClient.post(endpoint, payload);
  return response.data;
}

export async function updateTask(taskId, payload) {
  const template = requireEndpoint(
    apiConfig.endpoints.taskUpdateTemplate,
    'Task update',
    'VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE',
  );
  const endpoint = applyPathTemplate(template, { id: taskId });
  const response = await apiClient.patch(endpoint, payload);
  return response.data;
}

export async function deleteTask(taskId) {
  const template = requireEndpoint(
    apiConfig.endpoints.taskDeleteTemplate,
    'Task deletion',
    'VITE_API_TASK_DELETE_ENDPOINT_TEMPLATE',
  );
  const endpoint = applyPathTemplate(template, { id: taskId });
  const response = await apiClient.delete(endpoint);
  return response.data;
}
