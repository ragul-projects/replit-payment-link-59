import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'admin' | 'developer' | 'user';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredRole,
  fallbackPath = '/admin/login' 
}: ProtectedRouteProps) {
  const { state, hasPermission } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!state.isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && state.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <Alert variant="destructive">
              <AlertDescription>
                You don't have the required role ({requiredRole}) to access this page.
                Your current role: {state.user?.role || 'unknown'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Insufficient Permissions</h2>
            <Alert variant="destructive">
              <AlertDescription>
                You don't have the required permission ({requiredPermission}) to access this page.
                Please contact your administrator for access.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has required permissions - render children
  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string,
  requiredRole?: 'admin' | 'developer' | 'user'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredPermission={requiredPermission} requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}