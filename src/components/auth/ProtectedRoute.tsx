
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage for traditional auth
      const localAuth = localStorage.getItem("isAuthenticated") === "true";
      
      // Also check Supabase session if using Supabase
      const { data } = await supabase.auth.getSession();
      const supabaseAuth = !!data.session;
      
      // User is authenticated if either method returns true
      setIsAuthenticated(localAuth || supabaseAuth);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes in Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuth = !!session || localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(isAuth);
        setIsLoading(false);
        
        // If user signed out, make sure localStorage is cleared too
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem("isAuthenticated");
        }
      }
    );

    return () => {
      // Clean up the subscription when the component unmounts
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children wrapped in the layout
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;
