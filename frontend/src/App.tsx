import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ParentDashboard from './pages/ParentDashboard';
import FacilityDashboard from './pages/FacilityDashboard';
import GminaDashboard from './pages/GminaDashboard';
import ApplicationPage from './pages/ApplicationPage';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import AddHeadmaster from './pages/AddHeadmaster';

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
      { path: 'rodzic/nowy-wniosek', element: <ApplicationPage /> },
      { path: 'rodzic/moje-wnioski', element: <MyApplications /> },
      { path: 'rodzic/profil', element: <Profile /> },
      { path: 'placowka', element: <FacilityDashboard /> },
      { path: 'gmina', element: <GminaDashboard /> },
      { path: 'gmina/dodaj-dyrektora', element: <AddHeadmaster /> },
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
