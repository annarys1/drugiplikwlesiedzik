import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ParentDashboard from './pages/ParentDashboard';
import GminaDashboard from './pages/GminaDashboard';
import ApplicationPage from './pages/ApplicationPage';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import AddHeadmaster from './pages/AddHeadmaster';
import ProtectedRoute from './components/ProtectedRoute'; 
import AddInstitution from './pages/AddInstitution';
import DirectorDashboard from './pages/DirectorDashboard';
import FacilityDashboard from './pages/FacilityDashboard';
import  CriteriaManager from './pages/CriteriaManager';

const router = createBrowserRouter([
  // --- STREFA PUBLICZNA (Dostępna dla każdego) ---
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'logowanie', element: <Login /> },
      { path: 'rejestracja', element: <Register /> },
    ],
  },
  
  // --- STREFA CHRONIONA (Tylko zalogowani) ---
  {
    path: '/panel',
    element: <DashboardLayout />,
    children: [
      // --- STREFA RODZICA ---
      { 
        element: <ProtectedRoute allowedRoles={['parents']} />,
        children: [
          { path: 'rodzic', element: <ParentDashboard /> },
          { path: 'rodzic/nowy-wniosek', element: <ApplicationPage /> },
          { path: 'rodzic/moje-wnioski', element: <MyApplications /> },
          { path: 'profil', element: <Profile /> },
        ]
      },

      // --- STREFA GMINY (ADMIN) ---
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: 'gmina', element: <GminaDashboard /> },
          { path: 'gmina/dodaj-dyrektora', element: <AddHeadmaster /> },
          { path: 'gmina/dodaj-placowke', element: <AddInstitution /> },
        ]
      },

      // --- STREFA DYREKTORA ---
      {
      element: <ProtectedRoute allowedRoles={['headmaster']} />,
      children: [

        { 
          path: 'placowka', 
          element: <DirectorDashboard /> 
        },

        {
          path: 'placowka/wnioski',
          element: <FacilityDashboard />
        },

        {
          path: 'placowka/kryteria',
          element: <CriteriaManager />
        }

      ]
      }
    ],
  },
]); 

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}