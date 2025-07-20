import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../contexts/SearchContext';
import './Navbar.css';


function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useAuth();
  const { searchTerm, setSearchTerm } = useSearchContext();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-left">
        <a href="/" className="logo">Task Manager</a>
      </div>

      <div className="navbar-center">
        {state.isAuthenticated && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`global-search-input ${theme}`}
          />
        )}
      </div>

      <div className="navbar-right">
        {state.isAuthenticated && (
          <>
            <span className="welcome-text">Hello, {state.user?.displayName || state.user?.email}</span>
            <button onClick={toggleTheme} className="navbar-btn">Toggle Theme</button>
            <button onClick={handleLogout} className="navbar-btn logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
