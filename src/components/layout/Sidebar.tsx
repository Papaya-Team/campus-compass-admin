
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Users, Book, Calendar, FileText, School, UserPlus,
  BookOpen, Settings
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Tutors",
    href: "/tutors",
    icon: UserPlus,
  },
  {
    title: "Schools",
    href: "/schools",
    icon: School,
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: BookOpen,
  },
  {
    title: "Schedules",
    href: "/schedules",
    icon: Calendar,
  },
  {
    title: "Contracts",
    href: "/contracts",
    icon: FileText,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Book,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = ({ open }: SidebarProps) => {
  if (!open) return null;
  
  return (
    <aside className="w-[250px] border-r bg-sidebar p-4 hidden md:block overflow-y-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-lg font-semibold mb-2 text-sidebar-foreground px-4">
            Menu
          </h2>
          <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium",
                  item.href === window.location.pathname
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};
