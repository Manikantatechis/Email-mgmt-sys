import Loader from 'components/Loader';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { checkLogin } from 'services/authService';
import { loginStatus, selectIsAuthenticated } from 'store/auth/authSlice';

const AuthRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const isLoggedIn = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  // Function to check login status
  const checkLoginStatus = async () => {
    if (isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      const isAuthenticated = await checkLogin();
      dispatch(loginStatus(isAuthenticated));
      setIsAuthenticated(isAuthenticated || false);
    }
  };

  // Call checkLoginStatus when the component mounts (page loads/reloads)
  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isAuthenticated === undefined) {
    // Authentication status is still being checked, you can show a loading spinner or message here
    return <div style={{position:"fixed", top:0, left:0}}><Loader /></div>;
  }

  if (isAuthenticated) {
    // User is authenticated, render the child components
    return children;
  }

  // User is not authenticated, redirect to the login page
  return <Navigate to="/login" />;
};

export default AuthRoute;
