import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, List, Settings, Layout, CalendarDays, Tags } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: List, label: 'All Bookings', path: '/features' },
    { icon: PlusCircle, label: 'Add Booking', path: '/add' },
    { icon: Layout, label: 'Kanban Board', path: '/kanban' },
    { icon: CalendarDays, label: 'Timeline', path: '/timeline' },
    { icon: Tags, label: 'Categories', path: '/categories' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Trackify
        </h1>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
