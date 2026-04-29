import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Public pages
import { LandingPage }   from './pages/LandingPage';
import { LoginPage }     from './pages/LoginPage';
import { RegisterPage }  from './pages/RegisterPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { StatusPage }    from './pages/StatusPage';

// App pages
import { OverviewPage }  from './pages/OverviewPage';
import { ProductsPage }  from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { SettingsPage }  from './pages/SettingsPage';
import { EmailDigestPage } from './pages/EmailDigestPage';

// Layouts
import { AppLayout }      from './components/layout/AppLayout';
import { PublicLayout }   from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorPage }      from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path:         '/',
    element:      <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true,       element: <LandingPage />  },
      { path: 'login',     element: <LoginPage />    },
      { path: 'register',  element: <RegisterPage /> },
      { path: 'changelog', element: <ChangelogPage /> },
      { path: 'status',    element: <StatusPage />    },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true,          element: <OverviewPage />  },
      { path: 'products',     element: <ProductsPage />  },
      { path: 'customers',    element: <CustomersPage /> },
      { path: 'campaigns',    element: <CampaignsPage /> },
      { path: 'settings',     element: <SettingsPage />  },
      { path: 'email-digest', element: <EmailDigestPage /> },
    ],
  },
  {
    path:    '*',
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);