import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScrollToTop from './utilities/ScrollToTop';
import { Toaster } from "@/components/ui/sonner";
import { checkAuthUser } from './store/auth';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './components/Entrance/LandingPage';
import DashBoard from './pages/UserPages/DashBoard';
import TaskLayout from './components/User/TaskLayout';
import CheckAuth from './components/common/CheckAuth';
import UserProfile from './pages/UserPages/UserProfile';
import AddTask from './pages/UserPages/AddTask';
import ManualTask from './pages/UserPages/ManualTask';
import NotFound from './pages/auth/NotFound';
import UserHome from './pages/UserPages/UserHome'
import GoalDetail from './pages/UserPages/GoalDetail';
import SetNewPassword from './pages/UserPages/SetNewPassword';
import TermsOfService from './components/common/TermsOfService';
import PrivacyPolicy from './components/common/PrivacyPolicy';
const App = () => {
  const dispatch = useDispatch();
  const { user,isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  
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
    <div>
      <ScrollToTop />
      <CheckAuth isAuthenticated={isAuthenticated} >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='privacy-policy' element={<PrivacyPolicy/>} />
        <Route path='terms-service' element={<TermsOfService/>} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/user" element={<TaskLayout />}>
          <Route path="add-task" element={<AddTask />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path='home' element={<UserHome/>} />
          <Route path='profile' element={<UserProfile/>} />
          <Route path='add-manual' element={<ManualTask/>} />
          <Route path="goal/:goalId" element={<GoalDetail />} />
          <Route path='set-new-password' element={<SetNewPassword/>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </CheckAuth>
    </div>
  );
};

export default App;
