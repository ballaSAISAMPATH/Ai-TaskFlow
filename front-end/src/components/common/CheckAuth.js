import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;


    if (path === '/') {
      navigate(isAuthenticated ? '/user/update-progress' : '/');
    }

    if (
      isAuthenticated &&
      (path === '/auth/login' || path === '/auth/register')
    ) {
      navigate('/user/update-progress');
    }

    if (!isAuthenticated && path.startsWith('/user')) {
      navigate('/auth/login');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return children;
};

export default CheckAuth;
