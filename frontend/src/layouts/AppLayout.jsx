import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Icon from '../components/Icon';

const navigation = [
  { to: '/', label: 'Overview', icon: 'home', end: true },
  { to: '/planner', label: 'Study Planner', icon: 'planner' },
  { to: '/tasks', label: 'Tasks & Deadlines', icon: 'tasks' },
  { to: '/career', label: 'Career Advisor', icon: 'career' },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = localStorage.getItem('userRole');

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">AI</div>
          <div className="brand-copy">
            <strong>College Assistant</strong>
            <span>Academic & career support</span>
          </div>
          <button className="icon-button sidebar__close" type="button" onClick={closeMobile} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMobile}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button 
          type="button"
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{
            marginTop: 'auto',
            marginBottom: '12px',
            width: '100%',
            padding: '10px 14px', 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Log Out {role ? `(${role})` : ''}
        </button>

        <div className="sidebar-note" style={{ marginTop: 0 }}>
          <span className="sidebar-note__dot" />
          <div>
            <strong>SDG 4 · Quality Education</strong>
            <p>Personalized academic assistance with responsible AI integration.</p>
          </div>
        </div>
      </aside>

      {mobileOpen ? <button className="sidebar-overlay" aria-label="Close navigation" onClick={closeMobile} /> : null}

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button topbar__menu" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Icon name="menu" />
          </button>
          <div className="topbar__title">AI Autonomous College Assistant</div>
          <div className="topbar__badge">Semester 7</div>
        </header>
        <main className="content-wrap">
          <Outlet />
        </main>
        <footer className="footer">
          <span>AI Autonomous College Assistant</span>
          <span>React + Vite frontend · Backend integration-ready</span>
        </footer>
      </div>
    </div>
  );
}