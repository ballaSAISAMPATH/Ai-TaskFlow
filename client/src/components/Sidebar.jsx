// src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

function Sidebar() {
  const { theme } = useTheme();

  return (
    <div className={`sidebar ${theme}`}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Tasks
      </NavLink>
      <NavLink
        to="/completed-tasks"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Completed Tasks
      </NavLink>
    </div>
  );
}

export default Sidebar;
