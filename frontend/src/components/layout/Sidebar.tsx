import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconPackages,
  IconBuilds,
  IconActivity,
  IconHelp,
} from '../../assets/icons';

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '#dev';

const NAV_ITEMS = [
  { icon: IconDashboard, label: 'Dashboard', to: '/' },
  { icon: IconPackages, label: 'Packages', to: '/packages' },
  { icon: IconBuilds, label: 'Builds', to: '/builds' },
  { icon: IconActivity, label: 'Activities', to: '/activities' },
];

const IconChevronLeft: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true'
  );

  const toggleCollapsed = () => {
    setCollapsed(c => {
      const next = !c;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <aside
      className={`
        flex-shrink-0 flex flex-col items-center bg-secondary border-r border-white/5 py-5 gap-2 h-full
        transition-all duration-200 ease-in-out overflow-hidden
        ${collapsed ? 'w-[64px]' : 'w-44'}
      `}
    >
      {/* Logo */}
      <div className={`mb-2 flex items-center gap-3 px-3 w-full ${collapsed ? 'justify-center' : 'justify-start pl-4'}`}>
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <img src="/icons/icon.svg" className="w-10 h-10 object-contain" alt="AURCache" />
        </div>
        {!collapsed && (
          <span className="text-white font-semibold text-sm whitespace-nowrap overflow-hidden">
            AURCache
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
          const isActive =
            to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`
                group relative flex items-center gap-3 rounded-xl transition-all duration-150
                ${collapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              )}
              {/* Tooltip — only when collapsed */}
              {collapsed && (
                <span className="
                  absolute left-full ml-3 px-2.5 py-1.5 bg-[#0d0f13] border border-white/10
                  text-white text-xs font-medium rounded-lg whitespace-nowrap
                  opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity duration-150 z-50 shadow-xl
                ">
                  {label}
                </span>
              )}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute right-0 w-0.5 h-6 bg-primary rounded-l-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: GitHub + collapse toggle */}
      <div className={`flex flex-col gap-1 w-full px-2 ${collapsed ? 'items-center' : ''}`}>
        <a
          href="https://github.com/Lukas-Heiligenbrunner/AURCache"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? 'GitHub' : undefined}
          className={`
            group relative flex items-center gap-3 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150
            ${collapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-3 py-2.5'}
          `}
        >
          <IconHelp size={20} className="flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">GitHub</span>
          )}
          {collapsed && (
            <span className="
              absolute left-full ml-3 px-2.5 py-1.5 bg-[#0d0f13] border border-white/10
              text-white text-xs font-medium rounded-lg whitespace-nowrap
              opacity-0 pointer-events-none group-hover:opacity-100
              transition-opacity duration-150 z-50 shadow-xl
            ">
              GitHub
            </span>
          )}
        </a>

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            group relative flex items-center gap-3 rounded-xl text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-150
            ${collapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-3 py-2.5'}
          `}
        >
          <span className={`flex-shrink-0 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>
            <IconChevronLeft size={16} />
          </span>
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">Collapse</span>
          )}
          {collapsed && (
            <span className="
              absolute left-full ml-3 px-2.5 py-1.5 bg-[#0d0f13] border border-white/10
              text-white text-xs font-medium rounded-lg whitespace-nowrap
              opacity-0 pointer-events-none group-hover:opacity-100
              transition-opacity duration-150 z-50 shadow-xl
            ">
              Expand
            </span>
          )}
        </button>

        {/* Version */}
        {!collapsed && (
          <div className="px-3 pt-1">
            <span className="text-xs text-white/20 whitespace-nowrap">Version {APP_VERSION}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
