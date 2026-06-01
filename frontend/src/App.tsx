import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
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
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'rodzic',
        element: (
          <ProtectedRoute allowedRoles={['parents']}>
            <ParentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'placowka',
        element: (
          <ProtectedRoute allowedRoles={['facility']}>
            <FacilityDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'gmina',
        element: (
          <ProtectedRoute allowedRoles={['gmina']}>
            <GminaDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
