import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import TasksPage from './pages/TasksPage';
import CareerAdvisorPage from './pages/CareerAdvisorPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="planner" element={<StudyPlannerPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="career" element={<CareerAdvisorPage />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}