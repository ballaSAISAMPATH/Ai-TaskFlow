import axios from 'axios';
import { toast } from 'react-toastify';

export const getTasks = async (userId, status = '') => {
  try {
    const url = `/api/tasks?userId=${userId}${status ? `&status=${status}` : ''}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to load tasks');
    console.error(error);
    return [];
  }
};

export const addTask = async (taskData, userId) => {
  try {
    const formData = new FormData();

    for (const key in taskData) {
      if (taskData[key] !== undefined && taskData[key] !== null) {
        formData.append(key, taskData[key]);
      }
    }

    formData.append('userId', userId);

    const res = await axios.post(`/api/tasks`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('Task added!');
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add task');
    console.error(error);
    throw error;
  }
};

export const updateTask = async (id, updates) => {
  const res = await axios.patch(`/api/tasks/${id}`, updates);
  toast.success('Task updated!');
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`/api/tasks/${id}`);
  toast.success('Task deleted!');
  return res.data;
};

export const clearAllTasks = async (userId) => {
  await axios.post(`/api/tasks/clear-tasks`, { userId });
  toast.success('All tasks cleared!');
};
