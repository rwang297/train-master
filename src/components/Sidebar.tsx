"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiDatabase, FiUpload, FiSearch, FiUsers, FiFolder, FiSettings, FiFileText, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname() || "/";
  const isRepo = pathname.toLowerCase().startsWith("/repository");
  const isUpload = pathname.toLowerCase().startsWith("/upload");
  const isStaff = pathname.toLowerCase().startsWith("/staff");
  const isSettings = pathname.toLowerCase().startsWith("/settings");

  return (
    <aside className={`sidebar-root fixed md:fixed md:left-0 md:top-0 md:h-screen md:w-72 md:bg-white md:border-r md:border-slate-100 md:flex md:flex-col md:z-20 md:overflow-y-auto transition-transform duration-300 ${
      isOpen ? "translate-x-0 left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-20 overflow-y-auto" : "-translate-x-full left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-20 overflow-y-auto md:translate-x-0"
    }`}>
      <div className="px-4 pt-5 pb-4">
        <div className="brand-row flex items-center gap-3">
          <div className="brand-logo h-12 w-12 rounded-xl  text-white flex items-center justify-center shadow-sm">
             <div className="file-icon h-15 w-15 rounded-md  flex items-center justify-center text-sky-600">
                 <FiFileText />
               </div>
          </div>

          <div className="brand-text">
            <h3 className="text-sm font-semibold text-slate-800">TrainDocs</h3>
            <p className="text-xs text-slate-500">Training Reports Repository</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <nav className="px-4 py-4">
        <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Navigation</h4>
        <ul className="space-y-1">
          <li>
            <Link href="/repository" className={`nav-item relative flex items-center gap-3 w-full rounded-md px-3 py-2 ${isRepo ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {isRepo && <span className="indicator absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-tr-md rounded-br-md" aria-hidden />}
              <FiDatabase className="text-lg ml-2" aria-hidden />
              <span className="text-sm">Repository</span>
            </Link>
          </li>

          <li>
            <Link href="/upload" className={`nav-item flex items-center gap-3 w-full rounded-md px-3 py-2 ${isUpload ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {isUpload && <span className="indicator absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-tr-md rounded-br-md" aria-hidden />}
              <FiUpload className="text-lg text-slate-500" aria-hidden />
              <span className="text-sm">Upload Report</span>
            </Link>
          </li>

          <li>
            <Link href="/browse" className={`nav-item flex items-center gap-3 w-full rounded-md px-3 py-2 ${pathname.toLowerCase().startsWith('/browse') ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              <FiSearch className="text-lg text-slate-500" aria-hidden />
              <span className="text-sm">Browse</span>
            </Link>
          </li>

          <li>
            <Link href="/staff" className={`nav-item flex items-center gap-3 w-full rounded-md px-3 py-2 ${isStaff ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {isStaff && <span className="indicator absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-tr-md rounded-br-md" aria-hidden />}
              <FiUsers className="text-lg text-slate-500" aria-hidden />
              <span className="text-sm">Staff</span>
            </Link>
          </li>

          <li>
            <Link href="/settings" className={`nav-item relative flex items-center gap-3 w-full rounded-md px-3 py-2 ${isSettings ? 'bg-sky-50 text-sky-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {isSettings && <span className="indicator absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-tr-md rounded-br-md" aria-hidden />}
              <FiSettings className="text-lg text-slate-500" aria-hidden />
              <span className="text-sm">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-slate-100 mx-4" />

      <div className="px-4 py-4">
        <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Quick Stats</h4>
        <div className="stats space-y-2 text-sm text-slate-600">
          <div className="stat-row flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFolder className="text-slate-400" aria-hidden />
              <span>Total Reports</span>
            </div>
            <span className="text-sky-600 font-semibold">0</span>
          </div>

          <div className="stat-row flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h18v4H3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 11h14v10H5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>This Month</span>
            </div>
            <span className="text-sky-600 font-semibold">0</span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-4 pb-6">
        <div className="user-card p-3 rounded-lg bg-slate-50 flex items-center gap-3">
          <div className="user-avatar h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">U</div>
          <div className="user-info text-sm">
            <div className="font-medium text-slate-800">User</div>
            <div className="text-xs text-slate-500">Manage training reports</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
