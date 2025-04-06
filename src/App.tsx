
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./pages/Dashboard";
import UploadData from "./pages/UploadData";
import Visualize from "./pages/Visualize";
import NotFound from "./pages/NotFound";

// Pages to add later
const Recommendations = () => <div>Recommendations Page</div>;
const Gamification = () => <div>Gamification Page</div>;
const Scan = () => <div>Scan & Nudge Page</div>;
const Settings = () => <div>Settings Page</div>;

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, setIsAuthenticated } = useAppContext();
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? 
        <Navigate to="/" /> : 
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/upload" element={
        <ProtectedRoute>
          <DashboardLayout>
            <UploadData />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/visualize" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Visualize />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Recommendations />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gamification" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Gamification />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/scan" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Scan />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate checking authentication status
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse-light">
            <div className="flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-finance-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">SmartSpend</h1>
          </div>
          <p className="mt-2 text-gray-500">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
