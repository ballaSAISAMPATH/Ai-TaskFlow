import React from 'react';
import { useTasksContext } from '../contexts/TasksContext';
import TaskCard from '../components/TaskCard';
import { useTheme } from '../contexts/ThemeContext';
import { useSearchContext } from '../contexts/SearchContext';
import './CompletedTasksPage.css';

function CompletedTasksPage() {
  const { theme } = useTheme();
  const { completedTasks, handleToggleComplete, handleDeleteTask } = useTasksContext();
  const { searchTerm } = useSearchContext();

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredCompletedTasks = completedTasks
    .filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(task => ({
      ...task,
      highlightedTitle: getHighlightedText(task.title, searchTerm),
    }));

  return (
    <div className={`completed-tasks-page ${theme}`}>
      <h1 style={{ textAlign: 'center' }}>Completed Tasks</h1>
      {filteredCompletedTasks.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No completed tasks found.</p>
      ) : (
<ul>
  {filteredCompletedTasks.map((task) => (
    <TaskCard
      key={task._id}
      task={task}
      highlightedTitle={task.highlightedTitle}
      onToggleComplete={() => handleToggleComplete(task)}
      onDelete={() => handleDeleteTask(task._id)}
    />
  ))}
</ul>


      )}
    </div>
  );
}

export default CompletedTasksPage;
