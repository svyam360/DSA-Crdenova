import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { permissionService } from '../../services/auth/permissionService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'DSA' | 'AGENT')[];
  requiredScreen?: string;
  requiredAction?: 'view' | 'create' | 'edit' | 'approve' | 'export';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredScreen,
  requiredAction = 'view',
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  if (requiredScreen && currentUser) {
    const hasAccess = permissionService.hasPermission(currentUser.role, requiredScreen, requiredAction);
    if (!hasAccess) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
