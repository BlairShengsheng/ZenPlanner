import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const user = useSelector(state => state.session.user);
  const location = useLocation();

  if (!user) {
    // Redirect to /login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
// this commponent prevent from going back to homepage "/" by refreshing , protect every route ,
// which mean whenever I refresh, it wouldn't go back to homepage "/"
