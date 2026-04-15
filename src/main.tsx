import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import { AppLayout }       from './components/layout/AppLayout';
import { PublicLayout }    from './components/layout/PublicLayout';
import { ProtectedRoute }  from './components/layout/ProtectedRoute';
import { LandingPage }     from './pages/LandingPage';
import { LoginPage }       from './pages/LoginPage';
import { RegisterPage }    from './pages/RegisterPage';
import { OverviewPage }    from './pages/OverviewPage';
import { ProductsPage }    from './pages/ProductsPage';
import { CustomersPage }   from './pages/CustomersPage';
import { CampaignsPage }   from './pages/CampaignsPage';
import { SettingsPage }    from './pages/SettingsPage';
import { PricingPage }     from './pages/PricingPage';

const router = createBrowserRouter([
  {
    path:    '/',
    element: <PublicLayout />,
    children: [
      { index: true,      element: <LandingPage />  },
      { path: 'login',    element: <LoginPage />    },
      { path: 'register', element: <RegisterPage /> },
      { path: 'pricing',  element: <PricingPage />  },
    ],
  },
  {
    path:    '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,          element: <OverviewPage />  },
      { path: 'products',     element: <ProductsPage />  },
      { path: 'customers',    element: <CustomersPage /> },
      { path: 'campaigns',    element: <CampaignsPage /> },
      { path: 'settings',     element: <SettingsPage />  },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);