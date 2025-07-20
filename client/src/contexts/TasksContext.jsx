import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getTasks as apiGetTasks,
  addTask as apiAddTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  clearAllTasks as apiClearAllTasks
} from '../api/taskApi';
import { toast } from 'react-toastify';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchAllTasks();
    }
  }, [userId]);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await apiGetTasks(userId);
      setTasks(allTasks);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await apiAddTask(taskData, userId);
      setTasks((prev) => [newTask, ...prev]);
      // Alternatively:
      // await fetchAllTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to add task.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await apiUpdateTask(task._id, {
        completed: !task.completed,
      });
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiDeleteTask(id, userId);
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to delete task.');
    }
  };

  const handleClearTasks = async () => {
    try {
      await apiClearAllTasks(userId);
      setTasks([]);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to clear tasks.');
    }
  };

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <TasksContext.Provider
      value={{
        loading,
        tasks,
        activeTasks,
        completedTasks,
        handleAddTask,
        handleToggleComplete,
        handleDeleteTask,
        handleClearTasks,
        fetchAllTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  return useContext(TasksContext);
}
