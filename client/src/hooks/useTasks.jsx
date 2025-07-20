// src/hooks/useTasks.js
import { useState, useEffect } from 'react';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/taskApi') 
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, []);

  return tasks;
}
