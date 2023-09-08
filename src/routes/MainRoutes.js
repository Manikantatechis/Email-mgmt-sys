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
import AuthRoute from './AuthRoute'; // Adjust the import to your folder structure

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <AuthRoute>
          <DashboardDefault />
        </AuthRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <AuthRoute>
              <DashboardDefault />
            </AuthRoute>
          )
        }
      ]
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'sample-page',
      element: (
        <AuthRoute>
          <SamplePage />
        </AuthRoute>
      )
    },
    {
      path: 'users',
      element: (
        <AuthRoute>
          <UserList />
        </AuthRoute>
      )
    },
    {
      path: 'send',
      element: (
        <AuthRoute>
          <DataPreview />
        </AuthRoute>
      )
    },
    {
      path: 'credentials',
      element: (
        <AuthRoute>
          <CredentialManager />
        </AuthRoute>
      )
    },
    {
      path: 'template',
      element: (
        <AuthRoute>
          <TemplateManager />
        </AuthRoute>
      )
    }
  ]
};

export default MainRoutes;
