import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import IntegrationNotice from '../components/IntegrationNotice';
import Loader from '../components/Loader';
import StatusMessage from '../components/StatusMessage';
import StructuredResult from '../components/StructuredResult';
import { generateRevisionChecklist, generateStudyPlan, updateStudyProgress } from '../services/plannerService';
import { apiConfig } from '../services/config';
import { getFriendlyApiError } from '../services/apiClient';

const tabs = [
  { id: 'plan', label: 'Create plan' },
  { id: 'progress', label: 'Update progress' },
  { id: 'revision', label: 'Revision mode' },
];

export default function StudyPlannerPage() {
  const [tab, setTab] = useState('plan');
  const [form, setForm] = useState({ subjects: '', hoursPerDay: '', examDate: '', notes: '', planId: '', completed: '', hardTopics: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const endpointAvailable = {
    plan: apiConfig.endpoints.studyPlan,
    progress: apiConfig.endpoints.studyProgress,
    revision: apiConfig.endpoints.revision,
  }[tab];

  const envName = {
    plan: 'VITE_API_STUDY_PLAN_ENDPOINT',
    progress: 'VITE_API_STUDY_PROGRESS_ENDPOINT',
    revision: 'VITE_API_REVISION_ENDPOINT',
  }[tab];

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let data;
      if (tab === 'plan') {
        data = await generateStudyPlan({
          subjects: form.subjects.split(',').map((item) => item.trim()).filter(Boolean),
          hoursPerDay: form.hoursPerDay ? Number(form.hoursPerDay) : undefined,
          examDate: form.examDate || undefined,
          notes: form.notes.trim() || undefined,
        });
      } else if (tab === 'progress') {
        data = await updateStudyProgress({
          planId: form.planId.trim(),
          completed: form.completed.split(',').map((item) => item.trim()).filter(Boolean),
          hardTopics: form.hardTopics.split(',').map((item) => item.trim()).filter(Boolean),
        });
      } else {
        data = await generateRevisionChecklist({
          subjects: form.subjects.split(',').map((item) => item.trim()).filter(Boolean),
          examDate: form.examDate || undefined,
          notes: form.notes.trim() || undefined,
        });
      }
      setResult(data);
    } catch (requestError) {
      setError(getFriendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Module 2"
        title="Autonomous Study Planner"
        description="Generate personalized timelines, adapt upcoming work as progress changes, and switch into focused exam revision mode."
      />

      <div className="tab-list" role="tablist" aria-label="Study planner modes">
        {tabs.map((item) => (
          <button key={item.id} type="button" className={`tab-button ${tab === item.id ? 'tab-button--active' : ''}`} onClick={() => { setTab(item.id); setError(''); setResult(null); }}>
            {item.label}
          </button>
        ))}
      </div>

      {!endpointAvailable ? <IntegrationNotice envName={envName} /> : null}

      <div className="two-column-layout">
        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Planner input</span>
              <h2>{tabs.find((item) => item.id === tab)?.label}</h2>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            {tab === 'progress' ? (
              <>
                <label className="field">
                  <span className="field__label">Plan ID</span>
                  <input value={form.planId} onChange={(event) => updateForm('planId', event.target.value)} required placeholder="Backend study-plan identifier" />
                </label>
                <label className="field">
                  <span className="field__label">Completed items</span>
                  <input value={form.completed} onChange={(event) => updateForm('completed', event.target.value)} placeholder="Comma-separated topics or task IDs" />
                </label>
                <label className="field">
                  <span className="field__label">Topics marked hard</span>
                  <input value={form.hardTopics} onChange={(event) => updateForm('hardTopics', event.target.value)} placeholder="Comma-separated topics" />
                </label>
              </>
            ) : (
              <>
                <label className="field">
                  <span className="field__label">Subjects or topics</span>
                  <input value={form.subjects} onChange={(event) => updateForm('subjects', event.target.value)} required placeholder="Computer Networks, DBMS, Machine Learning" />
                </label>
                <div className="form-row">
                  {tab === 'plan' ? (
                    <label className="field">
                      <span className="field__label">Available hours per day</span>
                      <input type="number" min="0.5" step="0.5" value={form.hoursPerDay} onChange={(event) => updateForm('hoursPerDay', event.target.value)} placeholder="3" />
                    </label>
                  ) : null}
                  <label className="field">
                    <span className="field__label">Exam date</span>
                    <input type="date" value={form.examDate} onChange={(event) => updateForm('examDate', event.target.value)} />
                  </label>
                </div>
                <label className="field">
                  <span className="field__label">Additional constraints</span>
                  <textarea rows="4" value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Lab submissions, unavailable days, weak topics, or other planning context" />
                </label>
              </>
            )}

            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Working…' : tab === 'plan' ? 'Generate study plan' : tab === 'progress' ? 'Adapt upcoming plan' : 'Generate revision checklist'}
            </button>
          </form>
        </section>

        <section className="panel panel--result">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Generated output</span>
              <h2>Planner result</h2>
            </div>
          </div>
          {loading ? <Loader label="Building your academic roadmap…" /> : null}
          {error ? <StatusMessage type="error" title="Planner request failed">{error}</StatusMessage> : null}
          {!loading && !error && !result ? (
            <div className="result-placeholder">
              <div className="result-placeholder__mark">P</div>
              <h3>No plan generated yet</h3>
              <p>Once the backend endpoint is configured, its study plan or checklist response will be rendered here without hard-coded academic data.</p>
            </div>
          ) : null}
          {result ? <StructuredResult data={result} /> : null}
        </section>
      </div>
    </>
  );
}
