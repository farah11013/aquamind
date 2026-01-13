import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import VisualizationsPage from './pages/VisualizationsPage';
import DashboardPage from './pages/DashboardPage';
import FishIdentificationPage from './pages/FishIdentificationPage';
import DatasetAnalyticsPage from './pages/DatasetAnalyticsPage';
import APIPage from './pages/APIPage';
import AboutPage from './pages/AboutPage';
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
    name: 'Features',
    path: '/features',
    element: <FeaturesPage />,
  },
  {
    name: 'Visualizations',
    path: '/visualizations',
    element: <VisualizationsPage />,
  },
  {
    name: 'Fish ID',
    path: '/fish-identification',
    element: <FishIdentificationPage />,
  },
  {
    name: 'Analytics',
    path: '/dataset-analytics',
    element: <DatasetAnalyticsPage />,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    name: 'API',
    path: '/api',
    element: <APIPage />,
  },
  {
    name: 'About',
    path: '/about',
    element: <AboutPage />,
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
