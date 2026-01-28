import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import LiveDataPage from './pages/LiveDataPage';
import AIInsightsPage from './pages/AIInsightsPage';
import FishIdentificationPage from './pages/FishIdentificationPage';
import DatasetAnalyticsPage from './pages/DatasetAnalyticsPage';
import AlertsPage from './pages/AlertsPage';
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
    name: 'Live Data',
    path: '/live-data',
    element: <LiveDataPage />,
  },
  {
    name: 'AI Insights',
    path: '/ai-insights',
    element: <AIInsightsPage />,
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
    name: 'Alerts',
    path: '/alerts',
    element: <AlertsPage />,
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
