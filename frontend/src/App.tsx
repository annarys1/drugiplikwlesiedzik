import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ParentDashboard from './pages/ParentDashboard';
import FacilityDashboard from './pages/FacilityDashboard';
import GminaDashboard from './pages/GminaDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'logowanie', element: <Login /> },
      { path: 'rejestracja', element: <Register /> },
    ],
  },
  {
    path: '/panel',
    element: <DashboardLayout />,
    children: [
      { path: 'rodzic', element: <ParentDashboard /> },
      { path: 'placowka', element: <FacilityDashboard /> },
      { path: 'gmina', element: <GminaDashboard /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
