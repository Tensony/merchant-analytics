import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuth } = useAuthStore();
  const location = useLocation();

  if (!isAuth) {
    // Redirect to landing page, not login
    // Save the attempted location so we can redirect after login
    return (
      <Navigate
        to="/"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}