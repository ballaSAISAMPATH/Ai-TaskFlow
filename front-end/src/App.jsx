import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Toaster } from "@/components/ui/sonner";
import { checkAuthUser } from './store/auth';

import AuthLayout from './components/Auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './components/Entrance/LandingPage';
import Home from './pages/auth/UserPages/Home';
import UserTasks from './pages/auth/UserPages/UserTasks';
import DashBoard from './pages/auth/UserPages/DashBoard';
import TaskLayout from './components/User/TaskLayout';
import CheckAuth from './components/common/CheckAuth';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  console.log("isLoading : "+isLoading);
  
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthUser());
    };
    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-green-500">
        Checking authentication...
      </div>
    );
  }

  return (
  <CheckAuth isAuthenticated={isAuthenticated} >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/user" element={<TaskLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="tasks" element={<UserTasks />} />
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
      <Toaster richColors position="bottom-right" />
    </CheckAuth>
  );
};

export default App;
