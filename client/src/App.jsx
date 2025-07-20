import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CompletedTasksPage from './pages/CompletedTasksPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  const { state } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <BrowserRouter>
        {state.isAuthenticated && <Navbar />}
        {state.isAuthenticated && <Sidebar />}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {!state.isAuthenticated && (
              <>
               <Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
            {state.isAuthenticated && (
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/completed-tasks" element={<CompletedTasksPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </>
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
