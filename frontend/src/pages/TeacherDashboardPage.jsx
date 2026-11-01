import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';

export default function TeacherDashboardPage() {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [semester, setSemester] = useState('7'); // Defaulting to your 7th Sem
  const [priority, setPriority] = useState('High');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/teacher/assign-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          deadline: deadline,
          semester: semester,
          priority: priority,
          teacher_name: "Prof. Abizer" // Using the dummy teacher account name
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTitle('');
        setDeadline('');
      } else {
        setError(data.error || 'Failed to broadcast task.');
      }
    } catch (err) {
      setError('Network error: Ensure your Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Faculty Workspace"
        title="Teacher Command Center"
        description="Broadcast assignments, upload verified syllabus materials, and manage student workloads."
      />

      {error && <StatusMessage type="error" title="Action failed">{error}</StatusMessage>}
      {success && <StatusMessage type="success" title="Success!">{success}</StatusMessage>}

      <div className="task-layout">
        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Mass Assignment</span>
              <h2>Broadcast Task to Students</h2>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleAssign}>
            <label className="field">
              <span className="field__label">Assignment Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Complete Machine Learning Assignment 5" />
            </label>
            
            <div className="form-row">
              <label className="field">
                <span className="field__label">Target Semester</span>
                <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="all">All Semesters</option>
                  <option value="1">1st Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="7">7th Semester</option>
                </select>
              </label>

              <label className="field">
                <span className="field__label">Priority</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span className="field__label">Deadline</span>
              <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </label>

            <button className="button button--primary" type="submit" disabled={loading || !title.trim() || !deadline}>
              <Icon name="plus" size={17} /> {loading ? 'Broadcasting...' : 'Push to Student Dashboards'}
            </button>
          </form>
        </section>
        
       <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">AI Data Manager</span>
              <h2>Verified Knowledge Base</h2>
              <p style={{marginTop: '10px', marginBottom: '20px', color: 'var(--text-muted)'}}>
                Manage the active RAG vector index. Upload official SISTec lecture notes and past year questions (PYQs) so the AI assistant provides strictly faculty-approved answers.
              </p>
              <Link className="button button--secondary" to="/knowledge-base">
                Open Knowledge Base Manager <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}