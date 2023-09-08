import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { checkLogin } from 'services/authService';
import { selectIsAuthenticated } from 'store/auth/authSlice';

const AuthRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const isLoggedIn = useSelector(selectIsAuthenticated);

  // Function to check login status
  const checkLoginStatus = async () => {
    if (isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      const isAuthenticated = await checkLogin();
      setIsAuthenticated(isAuthenticated);
    }
  };

  // Call checkLoginStatus when the component mounts (page loads/reloads)
  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isAuthenticated === undefined) {
    // Authentication status is still being checked, you can show a loading spinner or message here
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // User is authenticated, render the child components
    return children;
  }

  // User is not authenticated, redirect to the login page
  return <Navigate to="/login" />;
};

export default AuthRoute;
