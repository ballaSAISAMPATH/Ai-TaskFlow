// src/pages/SignupPage.jsx

import React, { Component } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import './SignupPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.PUBLIC_URL}/task.jpeg) center center / cover no-repeat`,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SignupForm navigate={navigate} />
    </div>
  );
}

class SignupForm extends Component {
  static contextType = AuthContext;

  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '' });
  };

  handleSubmit = async (e) => {
  e.preventDefault();
  const { username, email, password, confirmPassword } = this.state;

  if (password !== confirmPassword) {
    this.setState({ error: 'Passwords do not match' });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userName: username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');

    this.context.dispatch({ type: 'LOGIN', payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id || data.user._id);
    this.props.navigate('/dashboard');
  } catch (error) {
    this.setState({ error: error.message });
  }
};



 handleGoogleSignup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    const res = await fetch(`${API_URL}/api/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google signup failed');

    this.context.dispatch({ type: 'LOGIN', payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id || data.user._id);
    this.props.navigate('/dashboard');
  } catch (error) {
    this.setState({ error: error.message });
  }
};


  render() {
    const { username, email, password, confirmPassword, error } = this.state;

    return (
      <div className="signup-container">
        <form onSubmit={this.handleSubmit}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <button type="submit">Sign Up</button>

          <button
            type="button"
            onClick={this.handleGoogleSignup}
            style={{
              marginTop: '10px',
              background: '#4285F4',
              color: '#fff',
              padding: '10px',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Sign Up with Google
          </button>
        </form>

        <p style={{ color: '#fff' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#66b2ff' }}>
            Login
          </Link>
        </p>
      </div>
    );
  }
}
