import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { permissionService } from '../../services/auth/permissionService';
import ThemeToggle from '../common/ThemeToggle';
import './AppLayout.css';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  screen: string;
}

const MENU_ITEMS: Record<string, MenuItem[]> = {
  ADMIN: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', screen: 'Dashboard' },
    { path: '/admin/leads', label: 'All Leads', icon: '📋', screen: 'Leads' },
    { path: '/admin/eligibility', label: 'Eligibility', icon: '🧮', screen: 'Eligibility' },
    { path: '/admin/applications', label: 'Applications', icon: '📄', screen: 'Applications' },
    { path: '/admin/documents', label: 'Documents & KYC', icon: '🗂️', screen: 'Documents' },
    { path: '/admin/dsas', label: 'DSA Management', icon: '👥', screen: 'DSA Management' },
    { path: '/admin/commissions', label: 'Commissions', icon: '💰', screen: 'Commissions' },
    { path: '/admin/rate-cards', label: 'Rate Cards & SLA', icon: '🏦', screen: 'Rate Cards & SLA' },
    { path: '/admin/reports', label: 'Reports', icon: '📈', screen: 'Reports' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: '🧾', screen: 'Audit Logs' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️', screen: 'Settings' },
  ],
  DSA: [
    { path: '/dsa/dashboard', label: 'Dashboard', icon: '📊', screen: 'Dashboard' },
    { path: '/dsa/leads', label: 'My Leads', icon: '📋', screen: 'Leads' },
    { path: '/dsa/applications', label: 'Applications', icon: '📄', screen: 'Applications' },
    { path: '/dsa/agents', label: 'My Agents', icon: '👤', screen: 'Agents' },
    { path: '/dsa/commissions', label: 'Earnings', icon: '💵', screen: 'Earnings' },
    { path: '/dsa/reports', label: 'Reports', icon: '📈', screen: 'Reports' },
  ],
  AGENT: [
    { path: '/agent/dashboard', label: 'Dashboard', icon: '📊', screen: 'Dashboard' },
    { path: '/agent/leads', label: 'My Leads', icon: '📋', screen: 'Leads' },
    { path: '/agent/applications', label: 'Applications', icon: '📄', screen: 'Applications' },
    { path: '/agent/earnings', label: 'My Earnings', icon: '💵', screen: 'Earnings' },
  ],
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const menuItems = (MENU_ITEMS[currentUser.role] || []).filter((item) =>
    permissionService.hasPermission(currentUser.role, item.screen, 'view')
  );

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">CN</span>
            {!sidebarCollapsed && <span className="logo-text">CredNova</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="app-header">
          <div className="header-left">
            <h1 className="header-title">CredNova</h1>
            <p className="header-subtitle">Unified DSA Lending Platform</p>
          </div>

          <div className="header-right">
            {/* ADD THEME TOGGLE HERE */}
            <ThemeToggle />
            <div className="header-user">
              <div className="user-avatar">{currentUser.name.charAt(0)}</div>
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role}</div>
              </div>
            </div>
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
