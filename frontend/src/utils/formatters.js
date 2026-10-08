export function formatLabel(value = '') {
  return String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDate(value) {
  if (!value) return 'No deadline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function extractList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  const candidates = [data.tasks, data.items, data.results, data.data];
  return candidates.find(Array.isArray) || [];
}

export function getTaskId(task, fallbackIndex) {
  return task?.id ?? task?._id ?? task?.taskId ?? task?.task_id ?? fallbackIndex;
}

export function getTaskTitle(task) {
  return task?.title ?? task?.name ?? task?.task ?? task?.description ?? 'Untitled task';
}

export function getTaskDeadline(task) {
  return task?.deadline ?? task?.dueDate ?? task?.due_date ?? task?.date ?? null;
}

export function getTaskStatus(task) {
  return task?.status ?? (task?.completed ? 'Completed' : 'Pending');
}

export function getTaskPriority(task) {
  return task?.priority ?? task?.urgency ?? task?.difficulty ?? 'Normal';
}
