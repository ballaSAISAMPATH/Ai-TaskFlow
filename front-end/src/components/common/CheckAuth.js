import React from 'react'
import { useLocation } from 'react-router-dom'
const CheckAuth = ({isAuthenticated}) => {
    const location = useLocation()
  return (
    <div>
      if(isAuthenticated)
      {

      }
    </div>
  )
}

export default CheckAuth
