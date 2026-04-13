import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage }   from './pages/OverviewPage';
import { ProductsPage }   from './pages/ProductsPage';
import { CustomersPage }  from './pages/CustomersPage';
import { CampaignsPage }  from './pages/CampaignsPage';
import { SettingsPage }   from './pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true,        element: <OverviewPage />   },
      { path: 'products',   element: <ProductsPage />   },
      { path: 'customers',  element: <CustomersPage />  },
      { path: 'campaigns',  element: <CampaignsPage />  },
      { path: 'settings',   element: <SettingsPage />   },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);