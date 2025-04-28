
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NavBar } from './NavBar';
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col bg-background ${sidebarOpen ? 'sidebar-active' : 'sidebar-collapsed'}`}>
      <NavBar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        
        <main className="main-content flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          <div className="container mx-auto max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Add Toaster component for better error visibility */}
      <Toaster />
    </div>
  );
};
