import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role, children, loginPath = '/masuk' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user || user.role !== role) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }
  return children;
}
