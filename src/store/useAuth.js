import { useEffect } from "react";
import useAuthStore from "./authStore";

// Custom hook for authentication operations
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError,
    checkAuth,
    getUserInfo,
    getUserName,
    getUserEmail,
    getUserId,
  } = useAuthStore();

  // Auto-check authentication on mount
  useEffect(() => {
    // You can add any initialization logic here
    // For example, validate stored tokens or refresh user data
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    signup,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError,

    // Utilities
    checkAuth,
    getUserInfo,
    getUserName,
    getUserEmail,
    getUserId,

    // Computed values
    isLoggedIn: checkAuth(),
  };
};

// HOC for protecting routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated || !user) {
      // Redirect to login or show login component
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access this page.
            </p>
            {/* Add your login redirect logic here */}
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};
