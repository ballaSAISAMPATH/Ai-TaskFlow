import React, { useEffect, useState, useCallback } from 'react';
import AddTaskModal from './AddTaskModal';
import TaskCard from './TaskCard';
import { useTheme } from '../contexts/ThemeContext';
import { useSearchContext } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask
} from '../api/taskApi';
import './TasksList.css';

function TasksList() {
  const { theme } = useTheme();
  const { searchTerm } = useSearchContext();
  const { state } = useAuth();
  const user = state.user;

  // ✅ USE user.id, NOT uid
  const userId = user?.id;

  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      console.log("No userId found in AuthContext");
      return;
    }
    const data = await getTasks(userId);
    console.log("Fetched tasks:", data);
    setTasks(data);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    if (!userId) return;
    await addTask(taskData, userId);
    await fetchTasks();
  };

  const handleToggleComplete = async (task) => {
    if (!userId) return;
    await updateTask(task._id, { completed: !task.completed }, userId);
    await fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    if (!userId) return;
    await deleteTask(id, userId);
    await fetchTasks();
  };

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

  const filteredTasks = tasks
    .filter((task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const aMatch = a.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const bMatch = b.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return bMatch - aMatch;
    });

  if (!userId) {
    return (
      <div className={`tasks-list-container ${theme}`}>
        <p>Please log in to view tasks.</p>
      </div>
    );
  }

  return (
    <div className={`tasks-list-container ${theme}`}>
      <div className="tasks-header">
        <AddTaskModal onTaskAdded={handleAddTask} />
      </div>
      <ul className="tasks-list">
        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={{
                ...task,
                highlightedTitle: getHighlightedText(task.title, searchTerm),
                searchTerm,
              }}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default TasksList;
