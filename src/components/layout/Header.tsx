import React, { useState } from 'react';
import { Menu, Moon, Sun, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export function Header({ toggleSidebar, toggleTheme, isDark }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/features?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue(''); // Clear after search
    }
  };

  return (
    <header className="h-16 clay-header border-b border-border/50 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-secondary/70 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search bookings... (Press Enter)" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="clay-input w-64 pl-9 pr-4 py-2 bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/70 relative transition-colors clay-btn-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/70 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
