import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // TWÓJ PLIK
import ProtectedRoute from './components/ProtectedRoute'; // TWÓJ PLIK

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
    // --- TWÓJ WKŁAD: Chronimy cały segment /panel ---
    element: <ProtectedRoute />, 
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // --- TWÓJ WKŁAD: Tutaj sprawdzamy konkretne role (OD KOLEGÓW) ---
          { 
            path: 'rodzic', 
            element: <ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute> 
          },
          { 
            path: 'placowka', 
            element: <ProtectedRoute allowedRoles={['FACILITY']}><FacilityDashboard /></ProtectedRoute> 
          },
          { 
            path: 'gmina', 
            element: <ProtectedRoute allowedRoles={['GMINA']}><GminaDashboard /></ProtectedRoute> 
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    // --- TWÓJ WKŁAD: AuthProvider musi być na samej górze ---
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
