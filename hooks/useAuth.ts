"use client";
import { useState, useEffect } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  needsRefresh: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    needsRefresh: false,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const data = await response.json();
      
      if (response.ok) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          needsRefresh: data.needsRefresh || false,
        });
        
        // Auto-refresh token if needed
        if (data.needsRefresh) {
          await refreshToken();
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          needsRefresh: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        needsRefresh: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (response.ok) {
        setAuthState(prev => ({
          ...prev,
          needsRefresh: false,
        }));
      } else {
        await signOut();
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      await signOut();
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      needsRefresh: false,
    });
  };

  const onAuthenticated = () => {
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      needsRefresh: false,
    });
  };

  useEffect(() => {
    checkAuth();
    
    // Check auth status periodically
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...authState,
    onAuthenticated,
    signOut,
    refreshToken,
  };
}