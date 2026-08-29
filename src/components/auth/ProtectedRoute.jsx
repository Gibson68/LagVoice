/**
 * ProtectedRoute
 * Route wrapper that checks authentication and role-based access
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on actual role
    const dashboards = {
      student: '/student',
      faculty: '/faculty',
      admin: '/admin',
      external: '/external',
    }
    return <Navigate to={dashboards[role] || '/login'} replace />
  }

  return children
}
