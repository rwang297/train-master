"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface ResponsiveSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ResponsiveSearch({
  value,
  onChange,
  placeholder = "Search reports by title, description, or tags",
}: ResponsiveSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Search - Icon only */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md"
          aria-label="Open search"
        >
          <FiSearch size={20} />
        </button>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 h-10 rounded-md border border-gray-500 px-3 text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                onChange("");
              }}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md"
              aria-label="Close search"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Search - Full width input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden md:flex flex-1 h-10 rounded-md border border-gray-500 px-3 text-black"
      />
    </>
  );
}
