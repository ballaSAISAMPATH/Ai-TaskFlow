import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;

    if (path === '/') {
      navigate(isAuthenticated ? '/user/home' : '/');
    }

    if (
      isAuthenticated &&
      (path === '/auth/login' || path === '/auth/register')
    ) {
      navigate('/user/home');
    }

    if (!isAuthenticated && path.startsWith('/user')) {
      navigate('/auth/login');
    }

    if (
      isAuthenticated && 
      user && 
      user.authProvider === 'google' && 
      path === '/user/set-new-password'
    ) {
      toast.error('Password change is not available for Google authenticated accounts');
      navigate('/user/home');
    }
  }, [location.pathname, isAuthenticated, user, navigate]);

  return children;
};

export default CheckAuth;