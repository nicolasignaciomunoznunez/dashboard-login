import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar con control de estado colapsado */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={setSidebarCollapsed} 
      />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
        <Header />
        
        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(false)}
        />
      )}
    </div>
  );
}