import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import DatasetAnalyticsPage from './pages/DatasetAnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'About',
    path: '/about',
    element: <AboutPage />,
  },
  {
    name: 'Features',
    path: '/features',
    element: <FeaturesPage />,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    element: <DatasetAnalyticsPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <RegisterPage />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
