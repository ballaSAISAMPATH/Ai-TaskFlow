
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TasksProvider } from './contexts/TasksContext';
import { SearchProvider } from './contexts/SearchContext'; // ✅ ADD THIS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>            {/* ✅ WRAP YOUR APP WITH SEARCH PROVIDER */}
          <TasksProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </TasksProvider>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
