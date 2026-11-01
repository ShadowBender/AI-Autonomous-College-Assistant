const BASE_URL = 'http://127.0.0.1:5000';

export async function listTasks() {
  const response = await fetch(`${BASE_URL}/api/tasks`);
  if (!response.ok) throw new Error('Failed to load tasks from the server.');
  return response.json();
}

export async function createTask(data) {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create task.');
  return response.json();
}

export async function updateTask(id, data) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update task.');
  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task.');
  return response.json();
}