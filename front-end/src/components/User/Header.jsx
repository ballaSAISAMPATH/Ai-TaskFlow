import React from 'react'

const Header = () => {
  return (
 <nav >
      <div >
        <div>Task Manager Logo </div>
      </div>



      <button onClick={toggleTheme} className="navbar-btn">Toggle Theme</button>
      <button onClick={handleLogout} className="navbar-btn logout-btn">Logout</button>
      
    </nav>
  )
}

export default Header
