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
  );
}