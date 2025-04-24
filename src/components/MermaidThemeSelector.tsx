"use client";

import { useState } from 'react';
import { MermaidTheme } from './MermaidDiagram';
import { ChevronDown } from 'lucide-react';

interface MermaidThemeSelectorProps {
  currentTheme: MermaidTheme;
  onChange: (theme: MermaidTheme) => void;
}

const themeOptions: { value: MermaidTheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'forest', label: 'Forest' },
  { value: 'neutral', label: 'Neutral' }
];

export default function MermaidThemeSelector({ currentTheme, onChange }: MermaidThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectTheme = (theme: MermaidTheme) => {
    onChange(theme);
    setIsOpen(false);
  };

  // Find the current theme label
  const currentThemeLabel = themeOptions.find(option => option.value === currentTheme)?.label || 'Default';

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gunmetal dark:text-periwinkle bg-white dark:bg-delft-blue border border-periwinkle/30 dark:border-periwinkle/20 rounded-md shadow-sm hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5 focus:outline-none focus:ring-2 focus:ring-delft-blue dark:focus:ring-periwinkle transition-colors"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="mr-2">Theme: {currentThemeLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-delft-blue ring-1 ring-periwinkle/30 dark:ring-periwinkle/20 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentTheme === option.value 
                    ? 'bg-periwinkle/10 dark:bg-periwinkle/20 text-gunmetal dark:text-periwinkle' 
                    : 'text-gunmetal dark:text-periwinkle hover:bg-periwinkle/5 dark:hover:bg-periwinkle/10'
                }`}
                role="menuitem"
                onClick={() => selectTheme(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
