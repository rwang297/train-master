"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ClientErrorHandler from "./ClientErrorHandler";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const showSidebar = pathname.toLowerCase().startsWith("/repository") || pathname.toLowerCase().startsWith("/upload") || pathname.toLowerCase().startsWith("/browse") || pathname.toLowerCase().startsWith('/staff') || pathname.toLowerCase().startsWith('/settings');

  return (
    <div className="app-root min-h-screen flex">
      <ClientErrorHandler />
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'md:ml-72' : ''}`}>{children}</main>
    </div>
  );
}
