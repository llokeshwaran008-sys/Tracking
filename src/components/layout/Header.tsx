import React from 'react';
import { Menu, Moon, Sun, Search, Bell } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export function Header({ toggleSidebar, toggleTheme, isDark }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search features..." 
            className="w-64 pl-9 pr-4 py-2 bg-secondary border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 rounded-full text-muted-foreground hover:bg-secondary relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
