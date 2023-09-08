import React, { useEffect } from 'react';
import AuthLogin from './auth-forms/AuthLogin';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { userLogout } from 'services/authService';

function Logout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await userLogout();
    if(res){
         navigate('/login');
    }
   
  };
  useEffect(() => {
    handleLogout();
  }, []);
  return <AuthLogin />;
}

export default Logout;
