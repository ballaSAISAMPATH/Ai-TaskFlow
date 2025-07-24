import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, children }) => {
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
  }, [location.pathname, isAuthenticated, navigate]);

  return children;
};

export default CheckAuth;
