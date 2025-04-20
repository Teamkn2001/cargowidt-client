import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from '../layouts/HomeLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import MechanismPage from '@/pages/MechanismPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            {index: true, element: <HomePage />},
            { path: '/about', element: <AboutPage />},
            { path: '/mechanism', element: <MechanismPage />},
        ]
    }
])

export default function AppRouter() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}