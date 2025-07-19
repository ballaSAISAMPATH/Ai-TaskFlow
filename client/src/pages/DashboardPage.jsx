// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
  const { state } = useAuth();
  const user = state.user;

  return (
    <div className="dashboard-container">
      {state.isAuthenticated && user ? (
        <div className="dashboard-content">
          <p>Welcome, {user.displayName || user.email || 'User'}!</p>

          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User"
              className="user-avatar"
            />
          )}

          <ul className="user-info">
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>UID:</strong> {user.uid}
            </li>
          </ul>

          <details style={{ marginTop: '1rem' }}>
            <summary>Full user object</summary>
            <pre className="user-json">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default DashboardPage;
