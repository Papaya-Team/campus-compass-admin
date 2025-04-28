
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NavBar } from './NavBar';

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
        
        <main className="main-content overflow-y-auto p-3 md:p-4 lg:p-5">
          <div className="container mx-auto px-0 md:px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
