"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ClientErrorHandler from "./ClientErrorHandler";
import { FiMenu } from "react-icons/fi";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showSidebar = pathname.toLowerCase().startsWith("/repository") || pathname.toLowerCase().startsWith("/upload") || pathname.toLowerCase().startsWith("/browse") || pathname.toLowerCase().startsWith('/staff') || pathname.toLowerCase().startsWith('/settings');

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-root min-h-screen flex relative">
      <ClientErrorHandler />
      {showSidebar && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={closeSidebar}
              aria-hidden
            />
          )}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </>
      )}
      <main className={`flex-1 ${showSidebar ? 'md:ml-72' : ''} relative`}>
        {showSidebar && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-30 p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md bg-white shadow-sm"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={24} />
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
