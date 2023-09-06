import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import UserList from 'pages/authentication/userList';
import DataPreview from 'pages/sendEmailSms/DataPreview';
import AuthRegister from 'pages/authentication/auth-forms/AuthRegister';
import CredentialManager from 'pages/credentials/credentialManager';
import TemplateManager from 'pages/template/templateManager';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'users',
      element: <UserList />
    },
    {
      path: 'send',
      element: <DataPreview />
    },{
      path:"credentials",
      element:<CredentialManager />
    },{
      path:"template",
      element:<TemplateManager />
    }
  ]
};

export default MainRoutes;
