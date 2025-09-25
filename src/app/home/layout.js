'use client';

import { useState, useEffect } from 'react';
import SideBar from "./Components/sidebar";
import { ModeToggle } from '@/components/ModeToggle';
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Set active item based on current pathname
  const getActiveItem = () => {
    // Default to home if pathname is exactly /home
    if (pathname === '/home') return '/home';
    // Otherwise return the full pathname
    return pathname || '/home';
  };

  // Only update activeItem when pathname changes
  const activeItem = getActiveItem();

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        activeItem={activeItem}
      />
      
      <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex justify-end p-4">
          <ModeToggle />
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;