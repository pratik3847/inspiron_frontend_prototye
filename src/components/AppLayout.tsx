import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Upload, ShieldCheck, FileBarChart, Settings, LogOut, Bell, ChevronLeft, Menu, ArrowLeftRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Upload EDI', icon: Upload, path: '/upload' },
  { label: 'Validator', icon: ShieldCheck, path: '/validator' },
  { label: 'Reconciliation', icon: ArrowLeftRight, path: '/reconciliation' },
  { label: 'Reports', icon: FileBarChart, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const currentNav = navItems.find(n => n.path === location.pathname) || navItems[0];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300`}>
        <div className={`h-14 flex items-center ${collapsed ? 'justify-center' : 'px-4'} border-b border-sidebar-border`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">ED</span>
          </div>
          {!collapsed && <span className="ml-2.5 text-sm font-semibold text-foreground">EDI Parser</span>}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors active:scale-[0.97] ${
                  active ? 'bg-sidebar-accent text-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
          {!collapsed && user && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors ${collapsed ? 'justify-center' : ''}`}
            title="Sign out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-foreground">{currentNav.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors active:scale-95">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            {user && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
