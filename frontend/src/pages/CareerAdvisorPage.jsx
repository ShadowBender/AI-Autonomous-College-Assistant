import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import IntegrationNotice from '../components/IntegrationNotice';
import Loader from '../components/Loader';
import StatusMessage from '../components/StatusMessage';
import StructuredResult from '../components/StructuredResult';
import { analyzeSkillGap, generateInterviewPrep } from '../services/careerService';
import { apiConfig } from '../services/config';
import { getFriendlyApiError } from '../services/apiClient';

export default function CareerAdvisorPage() {
  const [mode, setMode] = useState('skills');
  const [form, setForm] = useState({ domain: '', currentSkills: '', targetRole: '', context: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const configured = mode === 'skills' ? apiConfig.endpoints.careerSkillGap : apiConfig.endpoints.careerInterview;
  const envName = mode === 'skills' ? 'VITE_API_CAREER_SKILL_GAP_ENDPOINT' : 'VITE_API_CAREER_INTERVIEW_ENDPOINT';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        domainInterest: form.domain.trim(),
        currentSkills: form.currentSkills.split(',').map((item) => item.trim()).filter(Boolean),
        targetRole: form.targetRole.trim() || undefined,
        context: form.context.trim() || undefined,
      };
      const data = mode === 'skills' ? await analyzeSkillGap(payload) : await generateInterviewPrep(payload);
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
        eyebrow="Module 4 · SDG 4 support"
        title="Career & Skill Readiness Advisor"
        description="Identify skill gaps and prepare targeted interview or aptitude practice for upcoming placement opportunities."
      />

      <div className="choice-cards">
        <button type="button" className={`choice-card ${mode === 'skills' ? 'choice-card--active' : ''}`} onClick={() => { setMode('skills'); setResult(null); setError(''); }}>
          <strong>Skill-gap analysis</strong>
          <span>Skills, certifications, and electives based on domain interest.</span>
        </button>
        <button type="button" className={`choice-card ${mode === 'interview' ? 'choice-card--active' : ''}`} onClick={() => { setMode('interview'); setResult(null); setError(''); }}>
          <strong>Placement & interview prep</strong>
          <span>Practice questions and structured preparation for recruitment drives.</span>
        </button>
      </div>

      {!configured ? <IntegrationNotice envName={envName} /> : null}

      <div className="two-column-layout">
        <section className="panel">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Student profile input</span>
              <h2>{mode === 'skills' ? 'Analyze readiness' : 'Prepare for placement'}</h2>
            </div>
          </div>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Domain interest</span>
              <input value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })} required placeholder="Web Development, ML, Data Science…" />
            </label>
            <label className="field">
              <span className="field__label">Current skills</span>
              <input value={form.currentSkills} onChange={(event) => setForm({ ...form, currentSkills: event.target.value })} placeholder="Java, Python, React, SQL" />
              <span className="field__hint">Enter comma-separated skills.</span>
            </label>
            <label className="field">
              <span className="field__label">Target role or placement area</span>
              <input value={form.targetRole} onChange={(event) => setForm({ ...form, targetRole: event.target.value })} placeholder="Software Engineer" />
            </label>
            <label className="field">
              <span className="field__label">Additional context</span>
              <textarea rows="4" value={form.context} onChange={(event) => setForm({ ...form, context: event.target.value })} placeholder="Upcoming drive, weak topics, preferred certification path, or other context" />
            </label>
            <button className="button button--primary" type="submit" disabled={loading || !form.domain.trim()}>
              {loading ? 'Analyzing…' : mode === 'skills' ? 'Analyze skill gap' : 'Generate practice set'}
            </button>
          </form>
        </section>

        <section className="panel panel--result">
          <div className="panel__heading">
            <div>
              <span className="eyebrow">Advisor output</span>
              <h2>Recommendations</h2>
            </div>
          </div>
          {loading ? <Loader label="Preparing recommendations…" /> : null}
          {error ? <StatusMessage type="error" title="Career advisor request failed">{error}</StatusMessage> : null}
          {!loading && !error && !result ? (
            <div className="result-placeholder">
              <div className="result-placeholder__mark">C</div>
              <h3>No recommendations yet</h3>
              <p>The backend response will appear here after the corresponding career endpoint is configured.</p>
            </div>
          ) : null}
          {result ? <StructuredResult data={result} /> : null}
        </section>
      </div>
    </>
  );
}
