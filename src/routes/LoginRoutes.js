import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import Logout from 'pages/authentication/logout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'logout',
      element: <Logout />
    }
  ]
};

export default LoginRoutes;
