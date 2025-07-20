import React from 'react'
import { NavLink } from 'react-router-dom'
const SideBar = () => {
  return (
    <div>
      <NavLink
        to="user/dashboard"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="user/tasks"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Tasks
      </NavLink>
      <NavLink
        to="user/completed-tasks"
        className={({ isActive }) => isActive ? 'active-link' : ''}
      >
        Completed Tasks
      </NavLink>
    </div>
  )
}

export default SideBar
