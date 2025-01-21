import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from '../layouts/HomeLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            {index: true, element: <HomePage />},
            { path: '/about', element: <AboutPage />},
            { path: '/reference', element: <div>Reference</div>},
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