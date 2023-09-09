import React, { useEffect } from 'react';
import AuthLogin from './auth-forms/AuthLogin';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { userLogout } from 'services/authService';
import { useDispatch } from 'react-redux';
import { logoutUser } from 'store/auth/authSlice';

function Logout() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await userLogout();
    if(res){
      dispatch(logoutUser)
         navigate('/login');
    }
   
  };
  useEffect(() => {
    handleLogout();
  }, []);
  return <AuthLogin />;
}

export default Logout;
