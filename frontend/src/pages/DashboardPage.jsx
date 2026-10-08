import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import { apiConfig, endpointLabels } from '../services/config';

const modules = [
  {
    title: 'Intelligent Academic Q&A',
    description: 'Ask questions from college documents with source-aware responses and simplified explanations.',
    to: '/ask',
    icon: 'ask',
    tag: 'RAG system',
  },
  {
    title: 'Autonomous Study Planner',
    description: 'Create personalized study timelines, adapt progress, and prepare focused revision checklists.',
    to: '/planner',
    icon: 'planner',
    tag: 'Adaptive planning',
  },
  {
    title: 'Smart Task & Deadline Tracker',
    description: 'Create and prioritize academic work, track deadlines, and keep critical dates visible.',
    to: '/tasks',
    icon: 'tasks',
    tag: 'Academic workflow',
  },
  {
    title: 'Career & Skill Readiness',
    description: 'Analyze skill gaps and prepare for placement interviews, aptitude, and technical discussions.',
    to: '/career',
    icon: 'career',
    tag: 'SDG 4 support',
  },
];

export default function DashboardPage() {
  const configurableKeys = Object.keys(endpointLabels);
  const configuredCount = configurableKeys.filter((key) => Boolean(apiConfig.endpoints[key])).length;
  
  // Function to open Botpress widget
  const openBotpress = (e) => {
    e.preventDefault();
    
    if (window.botpressWebChat) {
      // Standard Botpress v1 method
      window.botpressWebChat.sendEvent({ type: 'show' });
    } else if (window.botpress) {
      // Newer Botpress v2 method
      window.botpress.open();
    } else {
      // Fallback in case the chat is still loading
      alert("The AI chat is still loading. Please click the blue bubble in the bottom right directly!");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Student workspace"
        title="Your academic command center"
        description="A focused interface for academic Q&A, study planning, deadlines, and career readiness — built around the four project modules."
      />

      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="pill">Generative AI · RAG · AI Agents</span>
          <h2>One assistant for academic information and student progress.</h2>
          <p>
            The frontend is designed around the supplied project specification and intentionally avoids fake grades, statistics, or campus data.
          </p>
          <div className="hero-panel__actions">
            {/* Updated hero button to trigger Botpress */}
            <button className="button button--primary" onClick={openBotpress}>
              Ask an academic question <Icon name="arrow" size={17} />
            </button>
            <Link className="button button--secondary" to="/planner">Build a study plan</Link>
          </div>
        </div>
        <div className="integration-card">
          <div className="integration-card__top">
            <span>Backend integration</span>
            <strong>{configuredCount}/{configurableKeys.length}</strong>
          </div>
          <div className="progress-track" aria-label={`${configuredCount} of ${configurableKeys.length} endpoints configured`}>
            <span style={{ width: `${(configuredCount / configurableKeys.length) * 100}%` }} />
          </div>
          <p>
            API paths were not included in the supplied project information. Configure only the routes your existing backend actually exposes.
          </p>
          <code>VITE_API_BASE_URL={apiConfig.baseURL || 'not configured'}</code>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Core modules</span>
            <h2>Everything in one sober, consistent workspace</h2>
          </div>
        </div>
        <div className="module-grid">
          {modules.map((module, index) => {
            // Render a clickable div for Botpress, and a standard React Router Link for the rest
            if (module.to === '/ask') {
              return (
                <div 
                  className="module-card" 
                  key={module.title} 
                  onClick={openBotpress} 
                  role="button" 
                  tabIndex={0} 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="module-card__meta">
                    <div className="module-card__icon"><Icon name={module.icon} /></div>
                    <span>0{index + 1}</span>
                  </div>
                  <span className="module-card__tag">{module.tag}</span>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <span className="module-card__link">Open module <Icon name="arrow" size={16} /></span>
                </div>
              );
            }

            return (
              <Link className="module-card" to={module.to} key={module.title}>
                <div className="module-card__meta">
                  <div className="module-card__icon"><Icon name={module.icon} /></div>
                  <span>0{index + 1}</span>
                </div>
                <span className="module-card__tag">{module.tag}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <span className="module-card__link">Open module <Icon name="arrow" size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-block info-grid">
        <div className="info-card">
          <span className="eyebrow">Design principle</span>
          <h3>Useful before decorative</h3>
          <p>Clear hierarchy, restrained colour, practical forms, and direct task flows keep the project presentation-ready without feeling like a generic dashboard template.</p>
        </div>
        <div className="info-card">
          <span className="eyebrow">Integration principle</span>
          <h3>No invented API contract</h3>
          <p>All backend calls are isolated in the service layer and remain disabled until the real route names are supplied through environment variables.</p>
        </div>
      </section>
    </>
  );
}