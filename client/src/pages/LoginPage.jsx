import React, { Component } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div
      className="login-page"
      style={{
        background: `
          linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url(${process.env.PUBLIC_URL}/image.png) center center / cover no-repeat
        `,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginForm navigate={navigate} />
    </div>
  );
}

class LoginForm extends Component {
  static contextType = AuthContext;

  state = {
    userName: '',
    email: '',
    password: '',
    error: '',
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: '',
    });
  };

  handleSubmit = async (e) => {
  e.preventDefault();
  const { userName, email, password } = this.state;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    this.context.dispatch({ type: 'LOGIN', payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id || data.user._id);
    this.props.navigate('/dashboard');
  } catch (error) {
    this.setState({ error: error.message });
  }
};



handleGoogleLogin = async () => {
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
    if (!res.ok) throw new Error(data.message || 'Google login failed');

    this.context.dispatch({ type: 'LOGIN', payload: data.user });
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id || data.user._id);
    this.props.navigate('/dashboard');
  } catch (error) {
    this.setState({ error: error.message });
  }
};



  render() {
    const { userName, email, password, error } = this.state;

    return (
      <div className="login-container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input id="userName" name="userName" type="text" value={userName} onChange={this.handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={email} onChange={this.handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={password} onChange={this.handleChange} required />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={this.handleGoogleLogin} style={{ backgroundColor: '#4285F4', color: '#fff', marginTop: '1rem', padding: '10px', border: 'none', borderRadius: '4px' }}>
            Login with Google
          </button>
        </form>
        <p style={{ color: '#fff' }}>Don’t have an account? <Link to="/signup" style={{ color: '#66b2ff' }}>Sign Up</Link></p>
      </div>
    );
  }
}
