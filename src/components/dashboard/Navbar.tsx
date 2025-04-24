"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Bell, Search, Settings } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  diagramName: string;
  isEditing: boolean;
  onDiagramNameClick: () => void;
  onDiagramNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiagramNameBlur: () => void;
  onDiagramNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

export default function Navbar({ 
  onMenuClick, 
  diagramName,
  isEditing,
  onDiagramNameClick,
  onDiagramNameChange,
  onDiagramNameBlur,
  onDiagramNameKeyDown,
  onLogout
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-periwinkle/30 dark:border-periwinkle/10 bg-white dark:bg-delft-blue">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gunmetal dark:text-periwinkle hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center">
              <img src="/images/logo-zoba.png" alt="ZOBA" className="h-8" />
            </Link>
            <span className="text-gunmetal/50 dark:text-ghost-white/50">/</span>
            <Link href="/dashboard" className="text-base text-gunmetal dark:text-ghost-white hover:text-delft-blue dark:hover:text-periwinkle transition-colors" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Dashboard
            </Link>
            <span className="text-gunmetal/50 dark:text-ghost-white/50">/</span>
            {diagramName === 'Your Diagrams' ? (
              <span className="text-base text-delft-blue dark:text-periwinkle" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Your Diagrams
              </span>
            ) : (
              <>
                <Link href="/your-diagrams" className="text-base text-gunmetal dark:text-ghost-white hover:text-delft-blue dark:hover:text-periwinkle transition-colors" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  Your Diagrams
                </Link>
                <span className="text-gunmetal/50 dark:text-ghost-white/50">/</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={diagramName}
                    onChange={onDiagramNameChange}
                    onBlur={onDiagramNameBlur}
                    onKeyDown={onDiagramNameKeyDown}
                    className="text-base bg-transparent border-b-2 border-periwinkle dark:border-periwinkle/70 focus:outline-none text-gunmetal dark:text-ghost-white px-1 w-64"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                    autoFocus
                  />
                ) : (
                  <button 
                    onClick={onDiagramNameClick}
                    className="text-base text-gunmetal dark:text-ghost-white hover:text-delft-blue dark:hover:text-periwinkle transition-colors duration-200 flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    {diagramName}
                    <span className="text-xs text-delft-blue/70 dark:text-periwinkle/70">(click to edit)</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search diagrams..."
              className="w-full px-4 py-2 rounded-md bg-ghost-white dark:bg-space-cadet border border-periwinkle/30 dark:border-periwinkle/10 
                text-gunmetal dark:text-ghost-white placeholder-gunmetal/50 dark:placeholder-ghost-white/50
                focus:outline-none focus:ring-2 focus:ring-delft-blue dark:focus:ring-periwinkle"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gunmetal/50 dark:text-ghost-white/50">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Mobile search button */}
          <button 
            className="md:hidden p-2 rounded-md text-gunmetal dark:text-periwinkle hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gunmetal dark:text-periwinkle hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-md text-gunmetal dark:text-periwinkle hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5">
            <Settings className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <div className="pl-2 border-l border-periwinkle/30 dark:border-periwinkle/10">
            <ThemeToggle />
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="ml-2 pl-2 border-l border-periwinkle/30 dark:border-periwinkle/10 p-2 rounded-md text-gunmetal dark:text-periwinkle hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Search - Collapsible */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search diagrams..."
              className="w-full px-4 py-2 rounded-md bg-ghost-white dark:bg-space-cadet border border-periwinkle/30 dark:border-periwinkle/10 
                text-gunmetal dark:text-ghost-white placeholder-gunmetal/50 dark:placeholder-ghost-white/50
                focus:outline-none focus:ring-2 focus:ring-delft-blue dark:focus:ring-periwinkle"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gunmetal/50 dark:text-ghost-white/50">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 