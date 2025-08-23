import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { state, hasPermission, isAdmin, isDeveloper } = useAuth();

  const canRead = hasPermission('read');
  const canWrite = hasPermission('write');
  const canDelete = hasPermission('delete');
  const canManageUsers = hasPermission('manage_users');
  const canManagePayments = hasPermission('manage_payments');
  const canManageApiKeys = hasPermission('manage_api_keys');

  const permissions = {
    canRead,
    canWrite,
    canDelete,
    canManageUsers,
    canManagePayments,
    canManageApiKeys,
    isAdmin: isAdmin(),
    isDeveloper: isDeveloper(),
    isUser: state.user?.role === 'user',
  };

  return permissions;
}