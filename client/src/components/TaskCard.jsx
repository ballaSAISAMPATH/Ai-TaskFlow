import React from 'react';
import './TaskCard.css';
import { useTheme } from '../contexts/ThemeContext';

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
}

function TaskCard({ task, highlightedTitle, onToggleComplete, onDelete }) {
  const { theme } = useTheme();

  return (
    <li className={`task-card ${theme} ${task.completed ? 'completed' : ''}`}>
      <div className="task-title">
        {highlightedTitle || task.title}
      </div>

      {task.imagePath && (
        <div className="task-image">
          <img src={`/${task.imagePath}`} alt="Task pic" />
        </div>
      )}

      <div className="task-details">
        {task.createdAt && (
          <div className="task-time">
            <strong>Created:</strong> {formatDateTime(task.createdAt)}
          </div>
        )}

        {(task.startTime || task.endTime) && (
          <div className="task-time">
            <strong>Scheduled:</strong>{" "}
            {task.startTime ? formatDateTime(task.startTime) : 'N/A'} →{" "}
            {task.endTime ? formatDateTime(task.endTime) : 'N/A'}
          </div>
        )}

        {task.completed && task.completedAt && (
          <div className="task-time">
            <strong>Completed:</strong> {formatDateTime(task.completedAt)}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onToggleComplete(task)}>
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
