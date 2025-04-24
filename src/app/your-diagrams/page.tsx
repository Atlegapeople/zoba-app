'use client';

import { useState, useEffect } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MermaidDiagram from '@/components/MermaidDiagram';
import Link from 'next/link';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import Navbar from '@/components/dashboard/Navbar';
import { Template } from '@/types/template';

interface SavedDiagram {
  _id: string;
  name: string;
  code: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function YourDiagramsPage() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('Your Diagrams');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
      setDiagrams(diagramsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diagram?')) return;
    
    try {
      await fetch(`/api/diagrams/${id}`, {
        method: 'DELETE',
      });
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete diagram:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-ghost-white dark:bg-space-cadet">
      {/* Navbar */}
      <Navbar 
        onMenuClick={toggleSidebar}
        diagramName={currentPage}
        isEditing={false}
        onDiagramNameClick={() => {}}
        onDiagramNameChange={() => {}}
        onDiagramNameBlur={() => {}}
        onDiagramNameKeyDown={() => {}}
        onLogout={() => {}}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden border-r border-periwinkle/30 dark:border-periwinkle/10 bg-white/80 dark:bg-delft-blue/80 backdrop-blur-sm flex flex-col h-full`}>
          <div className="p-6 border-b border-periwinkle/30 dark:border-periwinkle/10">
            <h2 className="text-xl font-bold text-gunmetal dark:text-ghost-white" 
              style={{ 
                fontFamily: 'var(--font-space-grotesk)',
                letterSpacing: '-0.5px'
              }}>
              Templates
            </h2>
          </div>
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="p-4 space-y-6">
                {/* Templates Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>TEMPLATES</h3>
                  <div className="space-y-2">
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-delft-blue"></div>
                      </div>
                    ) : templates.filter(t => !t.isExperimental).slice(0, 3).map((template) => (
                      <Link href={`/dashboard?template=${template._id}`} key={template._id}>
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue dark:text-periwinkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <span className="text-base text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>{template.name}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Experimental Templates Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-delft-blue/70 dark:text-periwinkle/70 px-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>EXPERIMENTAL</h3>
                  <div className="space-y-2">
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-delft-blue"></div>
                      </div>
                    ) : templates.filter(t => t.isExperimental).map((template) => (
                      <Link href={`/dashboard?template=${template._id}`} key={template._id}>
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60 rounded-lg transition-all duration-200 group">
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
                      </Link>
                    ))}
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
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <div className="flex justify-between items-center mb-8">
            <h1 
              className="text-3xl font-bold text-gunmetal dark:text-ghost-white" 
              style={{ 
                fontFamily: 'var(--font-space-grotesk)',
                letterSpacing: '-0.5px'
              }}
            >
              Your Diagrams
            </h1>
            <Link href="/dashboard">
              <Button 
                className="flex items-center gap-2 bg-delft-blue hover:bg-space-cadet text-ghost-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                <PlusCircle size={20} />
                Create New Diagram
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden border-periwinkle/30 dark:border-periwinkle/10">
                  <CardContent className="p-3">
                    <Skeleton className="h-[120px] w-full mb-3 bg-delft-blue/10 dark:bg-delft-blue/20" />
                    <Skeleton className="h-5 w-3/4 mb-2 bg-delft-blue/10 dark:bg-delft-blue/20" />
                    <Skeleton className="h-4 w-1/2 bg-delft-blue/10 dark:bg-delft-blue/20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : diagrams.length === 0 ? (
            <div className="text-center py-12">
              <h2 
                className="text-xl font-semibold text-gunmetal dark:text-ghost-white/70 mb-4"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                No diagrams yet
              </h2>
              <p 
                className="text-delft-blue/60 dark:text-periwinkle/60 mb-6"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Create your first diagram to get started
              </p>
              <Link href="/dashboard">
                <Button 
                  className="flex items-center gap-2 bg-delft-blue hover:bg-space-cadet text-ghost-white transition-all duration-200"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  <PlusCircle size={20} />
                  Create New Diagram
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {diagrams.map((diagram) => (
                <Card 
                  key={diagram._id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow border-periwinkle/30 dark:border-periwinkle/10 bg-white/80 dark:bg-delft-blue/80 backdrop-blur-sm"
                >
                  <CardContent className="p-3">
                    <div className="relative h-[120px] overflow-hidden mb-3 bg-white dark:bg-delft-blue rounded border border-periwinkle/30 dark:border-periwinkle/10">
                      <div className="absolute inset-0">
                        <MermaidDiagram code={diagram.code || ''} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 
                        className="font-semibold text-base text-gunmetal dark:text-ghost-white truncate"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {diagram.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p 
                          className="text-xs text-delft-blue/60 dark:text-periwinkle/60"
                          style={{ fontFamily: 'var(--font-geist-sans)' }}
                        >
                          {new Date(diagram.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1">
                          <Link href={`/dashboard?id=${diagram._id}`}>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-7 w-7 border-periwinkle/30 dark:border-periwinkle/10 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60"
                            >
                              <Edit2 size={14} className="text-delft-blue dark:text-periwinkle" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(diagram._id)}
                            className="h-7 w-7 border-periwinkle/30 dark:border-periwinkle/10 hover:bg-delft-blue/40 dark:hover:bg-delft-blue/60"
                          >
                            <Trash2 size={14} className="text-delft-blue dark:text-periwinkle" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 