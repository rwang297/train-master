"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ClientErrorHandler from "./ClientErrorHandler";
import { FiMenu, FiChevronLeft } from "react-icons/fi";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const showSidebar = pathname.toLowerCase().startsWith("/repository") || pathname.toLowerCase().startsWith("/upload") || pathname.toLowerCase().startsWith("/browse") || pathname.toLowerCase().startsWith('/staff') || pathname.toLowerCase().startsWith('/settings');

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="app-root min-h-screen flex relative">
      <ClientErrorHandler />
      {showSidebar && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={closeSidebar}
              aria-hidden
            />
          )}
          <div className={`transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${
            sidebarCollapsed ? "w-20 lg:w-20" : "w-72"
          } fixed lg:relative lg:translate-x-0 left-0 top-0 h-screen z-20 lg:z-auto`}>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} isCollapsed={sidebarCollapsed} />
          </div>
        </>
      )}
      <main className={`flex-1 relative transition-all duration-300`}>
        {showSidebar && (
          <>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed top-4 left-4 z-30 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md bg-white shadow-sm"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={24} />
            </button>
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex fixed bottom-6 left-6 z-30 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md bg-white shadow-sm"
              aria-label="Collapse sidebar"
            >
              <FiChevronLeft size={20} className={`transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </>
        )}
        {children}
      </main>
    </div>
  );
}
