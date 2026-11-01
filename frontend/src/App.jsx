import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import TasksPage from './pages/TasksPage';
import CareerAdvisorPage from './pages/CareerAdvisorPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import TeacherKnowledgeBasePage from './pages/TeacherKnowledgeBasePage';

export default function App() {
  const role = localStorage.getItem('userRole');

  // If no role is found in local storage, trap them at the login screen
  if (!role) {
    return <LoginPage />;
  }

  // If logged in, render the main app structure
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Standard Routes */}
          <Route index element={role === 'teacher' ? <TeacherDashboardPage /> : <DashboardPage />} />
          <Route path="planner" element={<StudyPlannerPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="career" element={<CareerAdvisorPage />} />
          <Route path="knowledge-base" element={<TeacherKnowledgeBasePage />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          
          {/* Future Teacher/Admin specific routes will go here */}
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Floating Logout Button for fast switching during your presentation */}
      <button 
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        style={{
          position: 'fixed', 
          bottom: '20px', 
          right: '85px', // Offset so it doesn't cover the Botpress chat bubble
          zIndex: 9999,
          padding: '10px 15px', 
          background: '#dc2626', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          fontWeight: 'bold'
        }}
      >
        Log Out ({role})
      </button>
    </>
  );
}