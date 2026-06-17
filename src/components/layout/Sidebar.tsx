import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, List, Layout, CalendarDays, Tags, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: List, label: 'All Bookings', path: '/features' },
    { icon: PlusCircle, label: 'Add Booking', path: '/add' },
    { icon: Layout, label: 'Kanban Board', path: '/kanban' },
    { icon: CalendarDays, label: 'Timeline', path: '/timeline' },
    { icon: Tags, label: 'Categories', path: '/categories' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Trackify
        </h1>
        {/* Close button - only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="w-64 bg-card border-r border-border h-screen flex-col hidden md:flex">
        <NavContent />
      </aside>

      {/* Mobile sidebar — slide in from left */}
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
