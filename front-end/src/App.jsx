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
import UserFeedBack from './pages/UserPages/UserFeedBack';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashBoard from './pages/AdminPages/AdminDashBoard';
import Reviews from './pages/AdminPages/Reviews';
import AdminProfile from './pages/AdminPages/AdminProfile';
const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);  
    console.log(user);
    
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthUser());
    };
    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />
      <CheckAuth isAuthenticated={isAuthenticated} user={user}>
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
            <Route path='feedback' element={<UserFeedBack/>} />
          </Route>
          <Route path='/admin' element={<AdminLayout/>}>
              <Route path='reviews' element={<Reviews/>} />
              <Route path='dashboard' element={<AdminDashBoard/>} />
              <Route path='profile' element={<AdminProfile/>} />
              <Route path='set-new-password' element={<SetNewPassword/>}/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="bottom-right" />
      </CheckAuth>
    </div>
  );
};

export default App;