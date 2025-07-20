import React from 'react'
import { Outlet } from 'react-router-dom'
const AuthLayout = () => {
  return (
    <div className="flex flex-col">
      This is Common Auth
      <div>
      <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
