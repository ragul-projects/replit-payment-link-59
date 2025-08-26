import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { SecurityManager } from '@/utils/security';

// Auth action types
type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; permissions: string[] } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SESSION_EXPIRED' };

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  permissions: [],
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        permissions: action.payload.permissions,
      };
    case 'LOGIN_FAILURE':
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return initialState;
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Auth context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isDeveloper: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check session on mount
  useEffect(() => {
    const checkSession = () => {
      if (SecurityManager.isSessionValid()) {
        const userData = localStorage.getItem('user_data');
        if (userData) {
          try {
            const { user, permissions } = JSON.parse(userData);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                token: SecurityManager.generateSecureToken(),
                permissions
              }
            });
          } catch (error) {
            console.error('Failed to restore session:', error);
            SecurityManager.clearSession();
          }
        }
      } else {
        SecurityManager.clearSession();
        localStorage.removeItem('user_data');
      }
    };

    checkSession();

    // Set up session timeout check
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if account is locked
      if (SecurityManager.isAccountLocked()) {
        SecurityManager.logSecurityEvent('login_attempt', false, { 
          email, 
          reason: 'account_locked' 
        });
        throw new Error('Account is temporarily locked due to multiple failed attempts');
      }

      // Rate limiting check
      if (!SecurityManager.checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000)) {
        SecurityManager.logSecurityEvent('login_attempt', false, { 
          email, 
          reason: 'rate_limited' 
        });
        throw new Error('Too many login attempts. Please try again later');
      }

      // Demo authentication - credentials removed for security
      // In production, this would be a secure API call
      const getDemoUser = (email: string) => {
        const userMap: Record<string, any> = {
          'admin@securepay.com': {
            user: {
              id: '1',
              name: 'System Administrator',
              email: 'admin@securepay.com',
              role: 'admin' as const,
              status: 'active' as const,
              createdAt: '2024-01-01T00:00:00Z',
              lastLogin: new Date().toISOString(),
            },
            permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_payments']
          },
          'dev@securepay.com': {
            user: {
              id: '2',
              name: 'Developer',
              email: 'dev@securepay.com',
              role: 'developer' as const,
              status: 'active' as const,
              createdAt: '2024-01-01T00:00:00Z',
              lastLogin: new Date().toISOString(),
            },
            permissions: ['read', 'write', 'manage_api_keys']
          },
          'user@securepay.com': {
            user: {
              id: '3',
              name: 'Regular User',
              email: 'user@securepay.com',
              role: 'user' as const,
              status: 'active' as const,
              createdAt: '2024-01-01T00:00:00Z',
              lastLogin: new Date().toISOString(),
            },
            permissions: ['read']
          }
        };
        return userMap[email];
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes - validate email format and check if user exists
      const foundUser = getDemoUser(email);
      
      // Simulate password validation (in production, this would be server-side)
      const isValidPassword = password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password);

      if (!foundUser || !isValidPassword) {
        SecurityManager.recordFailedLogin();
        SecurityManager.logSecurityEvent('login_attempt', false, { 
          email, 
          reason: 'invalid_credentials' 
        });
        throw new Error('Invalid email or password');
      }

      // Successful login
      SecurityManager.clearLoginAttempts();
      SecurityManager.createSession();
      SecurityManager.logSecurityEvent('login_success', true, { 
        email,
        role: foundUser.user.role 
      });

      // Store user data
      localStorage.setItem('user_data', JSON.stringify({
        user: foundUser.user,
        permissions: foundUser.permissions
      }));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: foundUser.user,
          token: SecurityManager.generateSecureToken(),
          permissions: foundUser.permissions
        }
      });

      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    SecurityManager.clearSession();
    SecurityManager.logSecurityEvent('logout', true, {
      userId: state.user?.id
    });
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    // Update stored user data
    const storedData = localStorage.getItem('user_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        data.user = { ...data.user, ...userData };
        localStorage.setItem('user_data', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to update stored user data:', error);
      }
    }
  };

  const hasPermission = (permission: string): boolean => {
    return state.permissions.includes(permission) || state.permissions.includes('admin');
  };

  const isAdmin = (): boolean => {
    return state.user?.role === 'admin';
  };

  const isDeveloper = (): boolean => {
    return state.user?.role === 'developer';
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    updateUser,
    hasPermission,
    isAdmin,
    isDeveloper,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}