import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PlatesTable from './components/PlatesTable';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import { Toaster } from './components/ui/sonner';

export interface User {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  avatar?: string;
}

export interface Plate {
  id: string;
  name?: string;
  shelf: string;
  previewImage: string;
  xtFile: string;
  health: 'new' | 'used' | 'locked';
  occupancy: 'free' | 'in-use';
  notes?: string;
  lastWorkName?: string;
  lastModifiedBy?: string;
  lastModifiedDate: Date;
  history: PlateHistoryEntry[];
}

export interface PlateHistoryEntry {
  id: string;
  action: string;
  user: string;
  date: Date;
  details?: string;
}

export type AppView = 'dashboard' | 'all-plates' | 'new-plates' | 'used-plates' | 'locked-plates' | 'free-plates' | 'in-use-plates' | 'ongoing-work' | 'history' | 'settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'auto' | 'light' | 'dark' | null;
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'normal' | 'large' | null;
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    
    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light', 'high-contrast');
    
    const applyTheme = () => {
      // Apply theme
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        // Light is default, no class needed
      } else {
        // Auto theme - use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        }
      }
    };

    applyTheme();
    
    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        root.classList.remove('dark');
        if (mediaQuery.matches) {
          root.classList.add('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    const fontSizes = {
      small: '12px',
      normal: '14px',
      large: '16px'
    };
    root.style.setProperty('--font-size', fontSizes[fontSize]);
  }, [fontSize, highContrast]);

  const handleLogin = (username: string, password: string, rememberMe: boolean) => {
    // Mock authentication - in real app, this would call an API
    const mockUser: User = {
      id: '1',
      name: 'John Smith',
      username: username,
      isAdmin: username === 'admin',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar 
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 w-full">
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'all-plates' && <PlatesTable user={user} />}
          {currentView === 'new-plates' && <PlatesTable user={user} filter="new-health" />}
          {currentView === 'used-plates' && <PlatesTable user={user} filter="used-health" />}
          {currentView === 'locked-plates' && <PlatesTable user={user} filter="locked-health" />}
          {currentView === 'free-plates' && <PlatesTable user={user} filter="free-occupancy" />}
          {currentView === 'in-use-plates' && <PlatesTable user={user} filter="in-use-occupancy" />}
          {currentView === 'ongoing-work' && <PlatesTable user={user} filter="ongoing-work" />}
          {currentView === 'history' && <PlatesTable user={user} filter="history" />}
          {currentView === 'settings' && (
            <Settings 
              theme={theme}
              fontSize={fontSize}
              highContrast={highContrast}
              onThemeChange={(newTheme) => {
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
              }}
              onFontSizeChange={(newSize) => {
                setFontSize(newSize);
                localStorage.setItem('fontSize', newSize);
              }}
              onHighContrastChange={(enabled) => {
                setHighContrast(enabled);
                localStorage.setItem('highContrast', enabled.toString());
              }}
            />
          )}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}