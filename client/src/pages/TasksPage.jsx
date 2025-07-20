import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import TasksList from '../components/TasksList';
import './TasksPage.css';

function TasksPage() {
  const { theme } = useTheme();

  return (
    <div className={`tasks-page ${theme}`}>
      <div className="tasks-page-content">
        <h1>Tasks</h1>
        <TasksList />
      </div>
    </div>
  );
}

export default TasksPage;
