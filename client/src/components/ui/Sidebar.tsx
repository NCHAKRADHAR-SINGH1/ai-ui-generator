import React, { useState } from 'react';

interface SidebarProps {
  children: React.ReactNode;
  collapsible?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, collapsible = true }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`
      bg-white border-r border-gray-200 h-full transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="p-4">
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            {collapsed ? '→' : '←'}
          </button>
        )}
        <div className={collapsed ? 'hidden' : 'block'}>
          {children}
        </div>
      </div>
    </div>
  );
};