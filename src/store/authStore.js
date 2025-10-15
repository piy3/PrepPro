import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Login action
      login: (loginResponse) => {
        if (loginResponse.success && loginResponse.loggedInUser) {
          set({
            user: loginResponse.loggedInUser,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });
          return true;
        } else {
          set({
            error: loginResponse.message || "Login failed",
            isLoading: false,
          });
          return false;
        }
      },

      // Signup action
      signup: (signupResponse) => {
        if (signupResponse.success && signupResponse.createdUser) {
          set({
            user: signupResponse.createdUser,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });
          return true;
        } else {
          set({
            error: signupResponse.message || "Signup failed",
            isLoading: false,
          });
          return false;
        }
      },

      // Update user info
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
        // Clear any stored tokens or session data here if needed
        localStorage.removeItem("auth-token"); // if you store tokens
      },

      // Check if user is logged in (useful for route protection)
      checkAuth: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && user !== null;
      },

      // Get user info
      getUserInfo: () => {
        const { user } = get();
        return user;
      },

      // Get user name
      getUserName: () => {
        const { user } = get();
        return user?.fullname || "";
      },

      // Get user email
      getUserEmail: () => {
        const { user } = get();
        return user?.email || "";
      },

      // Get user ID
      getUserId: () => {
        const { user } = get();
        return user?.id || "";
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist user and isAuthenticated
    }
  )
);

export default useAuthStore;
