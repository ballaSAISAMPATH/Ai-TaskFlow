import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/ThemeContext';
import './AddTaskModal.css';

function AddTaskModal({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      alert('Please fill all fields');
      return;
    }

    const newTask = {
      title,
      startTime,
      endTime,
      image,
      completed,
    };

    try {
      if (onTaskAdded) {
        await onTaskAdded(newTask);
      }
      setTitle('');
      setStartTime('');
      setEndTime('');
      setImage(null);
      setCompleted(false);
    } catch (error) {
      console.error(error);
      alert('Failed to add task');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`add-task-form ${theme}`}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className={`add-task-input ${theme}`}
        required
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className={`add-task-input ${theme}`}
        required
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className={`add-task-input ${theme}`}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className={`add-task-input ${theme}`}
      />
      <label className={`add-task-label ${theme}`}>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />{' '}
        Mark as completed
      </label>
      <button
        type="submit"
        className={`add-task-btn ${theme}`}
      >
        Add
      </button>
    </form>
  );
}

AddTaskModal.propTypes = {
  onTaskAdded: PropTypes.func,
};

export default AddTaskModal;
