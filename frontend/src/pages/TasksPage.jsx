import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import IntegrationNotice from '../components/IntegrationNotice';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusMessage from '../components/StatusMessage';
import Icon from '../components/Icon';
import { createTask, deleteTask, listTasks, updateTask } from '../services/taskService';
import { apiConfig } from '../services/config';
import { getFriendlyApiError } from '../services/apiClient';
import { extractList, formatDate, getTaskDeadline, getTaskId, getTaskPriority, getTaskStatus, getTaskTitle } from '../utils/formatters';

const initialForm = { title: '', type: 'Assignment', deadline: '', difficulty: 'Medium', notes: '' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(apiConfig.endpoints.taskList));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');

  const loadTasks = useCallback(async () => {
    if (!apiConfig.endpoints.taskList) return;
    setLoading(true);
    setError('');
    try {
      const data = await listTasks();
      setTasks(extractList(data));
    } catch (requestError) {
      setError(getFriendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    const value = filter.trim().toLowerCase();
    if (!value) return tasks;
    return tasks.filter((task) => getTaskTitle(task).toLowerCase().includes(value));
  }, [tasks, filter]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await createTask({
        title: form.title.trim(),
        type: form.type,
        deadline: form.deadline || undefined,
        difficulty: form.difficulty,
        notes: form.notes.trim() || undefined,
      });
      setForm(initialForm);
      setSuccess('Task created successfully.');
      await loadTasks();
    } catch (requestError) {
      setError(getFriendlyApiError(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (task, index) => {
    const id = getTaskId(task, index);
    const current = String(getTaskStatus(task)).toLowerCase();
    const nextStatus = current === 'completed' || current === 'done' ? 'Pending' : 'Completed';
    setError('');
    try {
      await updateTask(id, { status: nextStatus });
      await loadTasks();
    } catch (requestError) {
      setError(getFriendlyApiError(requestError));
    }
  };

  const handleDelete = async (task, index) => {
    const id = getTaskId(task, index);
    if (!window.confirm(`Delete “${getTaskTitle(task)}”?`)) return;
    setError('');
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (requestError) {
      setError(getFriendlyApiError(requestError));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Module 3"
        title="Smart Task & Deadline Tracker"
        description="Track lab assignments, project milestones, and academic deadlines with backend-driven status and priority information."
        action={apiConfig.endpoints.taskList ? <button type="button" className="button button--secondary" onClick={loadTasks}><Icon name="refresh" size={16} /> Refresh</button> : null}
      />

      {!apiConfig.endpoints.taskList ? <IntegrationNotice envName="VITE_API_TASKS_LIST_ENDPOINT" /> : null}

      {error ? <StatusMessage type="error" title="Task request failed">{error}</StatusMessage> : null}
      {success ? <StatusMessage type="success" title={success} /> : null}

      <div className="task-layout">
        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Add academic work</span>
              <h2>New task</h2>
            </div>
          </div>
          {!apiConfig.endpoints.taskCreate ? <IntegrationNotice envName="VITE_API_TASKS_CREATE_ENDPOINT" /> : null}
          <form className="form-stack" onSubmit={handleCreate}>
            <label className="field">
              <span className="field__label">Task title</span>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required placeholder="Submit DBMS lab assignment" />
            </label>
            <div className="form-row">
              <label className="field">
                <span className="field__label">Type</span>
                <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                  <option>Assignment</option>
                  <option>Lab</option>
                  <option>Project milestone</option>
                  <option>Exam</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="field">
                <span className="field__label">Difficulty</span>
                <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span className="field__label">Deadline</span>
              <input type="datetime-local" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">Notes</span>
              <textarea rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Optional context" />
            </label>
            <button className="button button--primary" type="submit" disabled={saving || !form.title.trim()}>
              <Icon name="plus" size={17} /> {saving ? 'Creating…' : 'Create task'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel__heading panel__heading--inline">
            <div>
              <span className="eyebrow">Academic workload</span>
              <h2>Tasks</h2>
            </div>
            <input className="compact-search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
          </div>

          {loading ? <Loader label="Loading tasks…" /> : null}
          {!loading && filteredTasks.length === 0 ? (
            <EmptyState title="No tasks to show" description={apiConfig.endpoints.taskList ? 'Create your first academic task or change the search filter.' : 'Configure the backend task-list endpoint to load real academic tasks.'} />
          ) : null}

          {!loading && filteredTasks.length > 0 ? (
            <div className="task-list">
              {filteredTasks.map((task, index) => {
                const status = String(getTaskStatus(task));
                const completed = ['completed', 'done'].includes(status.toLowerCase());
                return (
                  <article className={`task-item ${completed ? 'task-item--done' : ''}`} key={getTaskId(task, index)}>
                    <button className="task-check" type="button" onClick={() => handleToggleComplete(task, index)} aria-label={completed ? 'Mark task pending' : 'Mark task complete'}>
                      {completed ? <Icon name="check" size={16} /> : null}
                    </button>
                    <div className="task-item__body">
                      <h3>{getTaskTitle(task)}</h3>
                      <div className="task-item__meta">
                        <span>{formatDate(getTaskDeadline(task))}</span>
                        <span className="dot-separator">•</span>
                        <span>{getTaskPriority(task)}</span>
                        <span className="status-chip">{status}</span>
                      </div>
                    </div>
                    <button className="icon-button icon-button--danger" type="button" onClick={() => handleDelete(task, index)} aria-label="Delete task">
                      <Icon name="trash" size={18} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
