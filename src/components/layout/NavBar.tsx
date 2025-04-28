
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { UserNav } from './UserNav';

interface NavBarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const NavBar = ({ sidebarOpen, toggleSidebar }: NavBarProps) => {
  return (
    <header className="sticky top-0 z-30 bg-background border-b">
      <div className="flex h-16 items-center px-4">
        <Button 
          variant="ghost" 
          className="mr-2 md:mr-4" 
          onClick={toggleSidebar} 
          size="icon"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">Campus Compass</h1>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
};
