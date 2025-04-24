"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/components/theme-provider';

// Available Mermaid themes
export type MermaidTheme = 'default' | 'forest' | 'dark' | 'neutral';

interface MermaidDiagramProps {
  code: string;
  className?: string;
  /**
   * The Mermaid theme to use for rendering diagrams
   * Available options: 'default', 'forest', 'dark', 'neutral'
   * If not provided, will use 'default' for light mode and 'dark' for dark mode
   */
  mermaidTheme?: MermaidTheme;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, className = "", mermaidTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  
  // State for pan/zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter',
      });
      
      try {
        // Validate code before rendering
        if (!code || typeof code !== 'string' || code.trim() === '') {
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full w-full text-gray-400">
                <p>No diagram code available</p>
              </div>
            `;
            setIsRendered(true);
          }
          return;
        }

        mermaid.render('mermaid-diagram', code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.width = '100%';
              svgElement.style.height = '100%';
              svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            }
            setIsRendered(true);
          }
        }).catch((error) => {
          console.error('Failed to render diagram:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full w-full text-red-400">
                <p>Failed to render diagram</p>
              </div>
            `;
            setIsRendered(true);
          }
        });
      } catch (error) {
        console.error('Failed to render diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full w-full text-red-400">
              <p>Failed to render diagram</p>
            </div>
          `;
          setIsRendered(true);
        }
      }
    }
  }, [code]);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const themeConfig = {
      startOnLoad: true,
      theme: mermaidTheme || (isDark ? 'dark' : 'default'),
      fontFamily: 'var(--font-geist-sans)',
      securityLevel: 'loose' as const,
      flowchart: {
        htmlLabels: true,
        curve: 'basis' as const,
        useMaxWidth: false,
        diagramPadding: 8
      }
    };

    // Initialize Mermaid with the theme config
    mermaid.initialize(themeConfig);

    try {
      // Clear the container first
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Validate code before rendering
      if (!code || typeof code !== 'string' || code.trim() === '') {
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full w-full text-gray-400">
              <p>No diagram code available</p>
            </div>
          `;
          setIsRendered(true);
          return;
        }
      }
      
      // Generate a unique ID for this render
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      // Rerender the diagram with the new theme
      mermaid.render(id, code).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
          setIsRendered(true);
        }
      }).catch((error) => {
        console.error('Failed to render diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full w-full text-red-400">
              <p>Failed to render diagram: ${error.message}</p>
            </div>
          `;
          setIsRendered(true);
        }
      });
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full w-full text-red-400">
            <p>Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        `;
        setIsRendered(true);
      }
    }
  }, [code, theme, mermaidTheme]);

  // Resize observer to handle container changes
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        mermaid.contentLoaded();
      }
    });
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom functionality
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setScale(prevScale => {
      return Math.min(Math.max(prevScale + delta, 0.1), 3);
    });
  }, []);

  // Set up event listeners for pan and zoom
  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  // Apply transforms when scale or position changes
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        // Apply transform with !important to ensure it overrides any inline styles
        svgElement.style.setProperty('transform', `translate(${position.x}px, ${position.y}px) scale(${scale})`, 'important');
        svgElement.style.setProperty('transform-origin', 'top left', 'important');
      }
    }
  }, [scale, position]);

  // Reset zoom and position
  const handleResetZoom = useCallback(() => {
    // Reset scale and position
    setScale(1);
    setPosition({ x: 0, y: 0 });
    // Re-render the diagram which will recalculate everything
    if (containerRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className={`${className} relative w-full h-full overflow-hidden bg-white dark:bg-[#1B264F]`}>
      {/* Background div with gridRef */}
      <div 
        ref={gridRef}
        className="absolute inset-0 bg-white dark:bg-[#1B264F] w-full h-full" 
      />

      {/* Loading indicator */}
      {!isRendered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-delft-blue dark:text-periwinkle">
            Loading diagram...
          </div>
        </div>
      )}

      {/* Diagram container */}
      <div 
        className="absolute inset-0 w-full h-full"
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          opacity: isRendered ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <div 
          ref={containerRef} 
          className="absolute inset-0 w-full h-full" 
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 bg-white/90 dark:bg-delft-blue/90 p-1 rounded-lg shadow-lg">
        <button 
          onClick={() => setScale(s => Math.max(s - 0.1, 0.1))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button 
          onClick={handleResetZoom}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
        <button 
          onClick={() => setScale(s => Math.min(s + 0.1, 3))}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <span className="px-2 flex items-center text-sm font-medium">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100 px-3 py-2 rounded-md text-sm font-medium shadow-md">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Diagram Error
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;