"use client";

import { useState, useEffect } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import MermaidDiagram, { MermaidTheme } from '@/components/MermaidDiagram';
import MermaidThemeSelector from '@/components/MermaidThemeSelector';
import CodeEditor from '@/components/CodeEditor';
import DiagramVersionControl from '@/components/DiagramVersionControl';
import DiagramExportImport from '@/components/DiagramExportImport';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import Navbar from '@/components/dashboard/Navbar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import { Template } from '@/types/template';

interface SavedDiagram {
  _id: string;
  name: string;
  code: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [code, setCode] = useState('');
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDiagramName, setCurrentDiagramName] = useState('Untitled Diagram');
  const [isEditing, setIsEditing] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mermaidTheme, setMermaidTheme] = useState<MermaidTheme>('base');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  
  // Update dark mode detection and mermaid theme accordingly
  useEffect(() => {
    const isDarkMode = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    // Initialize with custom ZOBA theme instead of default/dark
    setMermaidTheme('base');
  }, [theme]);

  // Add custom Mermaid theme initialization
  useEffect(() => {
    // Initialize mermaid with ZOBA theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#273469', // delft-blue
        primaryTextColor: isDark ? '#E4D9FF' : '#273469', // periwinkle in dark, delft-blue in light
        primaryBorderColor: '#273469', // delft-blue
        lineColor: '#273469', // delft-blue
        secondaryColor: '#E4D9FF', // periwinkle
        tertiaryColor: isDark ? '#1B264F' : '#F5F5F5', // space-cadet in dark, light gray in light
        textColor: isDark ? '#E4D9FF' : '#273469', // periwinkle in dark, delft-blue in light
        mainBkg: isDark ? '#1B264F' : '#F5F5F5', // space-cadet in dark, light gray in light
        nodeBorder: '#273469', // delft-blue
        clusterBkg: '#E4D9FF', // periwinkle
        titleColor: isDark ? '#E4D9FF' : '#273469', // periwinkle in dark, delft-blue in light
      }
    });
  }, [isDark]);

  // Fetch diagrams and templates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch templates first
        const templatesResponse = await fetch('/api/templates');
        if (!templatesResponse.ok) throw new Error('Failed to fetch templates');
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);

        // Then fetch diagrams
        const diagramsResponse = await fetch('/api/diagrams');
        if (!diagramsResponse.ok) throw new Error('Failed to fetch diagrams');
        const diagramsData = await diagramsResponse.json();
        setSavedDiagrams(diagramsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize templates if needed
  useEffect(() => {
    const initializeTemplates = async () => {
      try {
        const response = await fetch('/api/templates', {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to initialize templates');
      } catch (error) {
        console.error('Error initializing templates:', error);
      }
    };

    initializeTemplates();
  }, []);

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleVersionSelect = (version: string) => {
    setCode(version);
  };

  const handleImport = (importedCode: string) => {
    setCode(importedCode);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/diagrams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentDiagramName,
          code: code,
          type: 'flowchart', // Default type, can be updated based on diagram content
        }),
      });

      if (!response.ok) throw new Error('Failed to save diagram');

      const newDiagram = await response.json();
      setSavedDiagrams([newDiagram, ...savedDiagrams]);
      toast.success('Diagram saved successfully');
    } catch (error) {
      console.error('Error saving diagram:', error);
      toast.error('Failed to save diagram');
    }
  };

  const handleDiagramNameClick = () => {
    setIsEditing(true);
  };

  const handleDiagramNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDiagramName(e.target.value);
  };

  const handleDiagramNameBlur = () => {
    setIsEditing(false);
  };

  const handleDiagramNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Show goodbye message
    toast('See you soon! 👋', {
      description: 'Thanks for using ZOBA',
      icon: '👋',
    });

    // Add slight delay before redirect to show the message
    setTimeout(() => {
      // Add any additional logout logic here (clear tokens, etc)
      router.push('/');
    }, 1500);
  };

  const handleTemplateSelect = (template: Template) => {
    setCode(template.code);
    setCurrentDiagramName(`New ${template.name}`);
  };

  return (
    <div className="flex flex-col h-screen bg-ghost-white dark:bg-space-cadet">
      {/* Navbar */}
      <Navbar 
        onMenuClick={toggleSidebar}
        diagramName={currentDiagramName}
        isEditing={isEditing}
        onDiagramNameClick={handleDiagramNameClick}
        onDiagramNameChange={handleDiagramNameChange}
        onDiagramNameBlur={handleDiagramNameBlur}
        onDiagramNameKeyDown={handleDiagramNameKeyDown}
        onLogout={handleLogout}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden border-r border-periwinkle/30 dark:border-periwinkle/10 bg-white/80 dark:bg-delft-blue/80 backdrop-blur-sm flex flex-col h-full`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-periwinkle/30 dark:border-periwinkle/10">
            <h2 className="text-xl font-bold text-gunmetal dark:text-ghost-white" 
              style={{ 
                fontFamily: 'var(--font-space-grotesk)',
                letterSpacing: '-0.5px'
              }}>
              Saved Diagrams
            </h2>
          </div>
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="p-4 space-y-6">
                {/* Style Section */}
                <div className="relative">
                  <div 
                    onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
                        <path d="M16 8L2 22"/>
                        <path d="M17.5 15H9"/>
                      </svg>
                      <span className="text-base font-medium text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>Style</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-delft-blue dark:text-periwinkle transition-transform duration-200 ${isStyleMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  
                  {/* Theme Submenu */}
                  <div className={`absolute left-0 right-0 mt-1 ${isStyleMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} bg-white dark:bg-delft-blue border border-periwinkle/30 dark:border-periwinkle/10 rounded-lg shadow-lg z-50 transition-all duration-200`}>
                    <div className="py-2">
                      {[
                        { name: 'base', colors: ['#F5F5F5', '#E4D9FF', '#273469', '#1B264F', '#576490'] },
                        { name: 'default', colors: ['#ffffff', '#f0f0f0', '#333333', '#666666'] },
                        { name: 'forest', colors: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d'] },
                        { name: 'dark', colors: ['#1a1a1a', '#2d2d2d', '#404040', '#666666'] },
                        { name: 'neutral', colors: ['#f5f5f5', '#e0e0e0', '#9e9e9e', '#616161'] }
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => {
                            setMermaidTheme(theme.name as MermaidTheme);
                            setIsStyleMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-base transition-colors duration-200 flex items-center justify-between ${
                            mermaidTheme === theme.name 
                              ? 'bg-periwinkle/10 dark:bg-periwinkle/5 text-delft-blue dark:text-ghost-white font-medium'
                              : 'text-gunmetal dark:text-periwinkle hover:bg-delft-blue/20 dark:hover:bg-delft-blue/40 hover:text-delft-blue dark:hover:text-ghost-white'
                          }`}
                          style={{ fontFamily: 'var(--font-geist-sans)' }}
                        >
                          <span>{theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}</span>
                          <div className="flex gap-1">
                            {theme.colors.map((color, index) => (
                              <div 
                                key={index}
                                className="w-4 h-4 rounded-full border border-periwinkle/20 dark:border-periwinkle/10"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>TEMPLATES</h3>
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-delft-blue"></div>
                      </div>
                    ) : templates.filter(t => !t.isExperimental).slice(0, 3).map((template) => (
                      <button
                        key={template._id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experimental Templates Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>EXPERIMENTAL</h3>
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-delft-blue"></div>
                      </div>
                    ) : templates.filter(t => t.isExperimental).map((template) => (
                      <button
                        key={template._id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200 group"
                      >
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-delft-blue dark:bg-periwinkle rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>{template.name}</span>
                          <span className="text-xs text-delft-blue/60 dark:text-periwinkle/60" style={{ fontFamily: 'var(--font-geist-sans)' }}>Beta Feature</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Version History Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>DIAGRAM ACTIONS</h3>
                  <div className="space-y-2">
                    <button onClick={() => {}} className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v5h5"/>
                        <path d="M3 3l6 6"/>
                        <path d="M21 21v-5h-5"/>
                        <path d="M21 21l-6-6"/>
                      </svg>
                      <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>Version History</span>
                    </button>
                    <button onClick={() => {}} className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>Export Diagram</span>
                    </button>
                    <button onClick={() => {}} className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <circle cx="12" cy="8" r="3"/>
                        <path d="M15 21v-4a3 3 0 0 0-6 0v4"/>
                      </svg>
                      <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>Share</span>
                    </button>
                  </div>
                </div>
                
                {/* Saved Diagrams Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>YOUR DIAGRAMS</h3>
                  <div className="space-y-2">
                    {isLoading ? (
                      [1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border border-periwinkle/30 dark:border-periwinkle/10 rounded-lg">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ))
                    ) : savedDiagrams.length === 0 ? (
                      <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        No diagrams yet
                      </div>
                    ) : (
                      savedDiagrams.map((diagram) => (
                        <button
                          key={diagram._id}
                          onClick={() => {
                            setCode(diagram.code);
                            setCurrentDiagramName(diagram.name);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <div className="flex flex-col items-start">
                            <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>{diagram.name}</span>
                            <span className="text-xs text-delft-blue/60 dark:text-periwinkle/60" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                              {new Date(diagram.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar 
              className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-periwinkle/10 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2" 
              orientation="vertical"
            >
              <ScrollArea.Thumb className="flex-1 bg-delft-blue/20 dark:bg-periwinkle/20 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          
          {/* Sidebar Footer */}
          <div className="p-6 border-t border-periwinkle/30 dark:border-periwinkle/10">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-delft-blue hover:bg-space-cadet text-ghost-white rounded-lg transition-all duration-200"
              style={{ 
                fontFamily: 'var(--font-geist-sans)',
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Diagram
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 flex h-full`}>
          {/* Editor Panel */}
          <div className="w-1/2 flex flex-col h-full bg-white dark:bg-delft-blue shadow-lg">
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                height="100%"
                className="absolute inset-0 w-full shadow-inner"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 flex flex-col h-full bg-white dark:bg-delft-blue border-l border-periwinkle/30 dark:border-periwinkle/10">
            <div className="flex-1 overflow-auto bg-white dark:bg-delft-blue p-6">
              <div className="h-full">
                <MermaidDiagram 
                  code={code} 
                  className="w-full h-full" 
                  mermaidTheme={mermaidTheme} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
