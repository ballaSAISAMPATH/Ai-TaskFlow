import React from 'react'
import Header from './Header'
import SideBar from './SideBar'

import { Outlet } from 'react-router-dom'
const TaskLayout = () => {
  return (
    <div>
      <Header />
      <SideBar />
      <Outlet />

    </div>
  )
}

export default TaskLayout
