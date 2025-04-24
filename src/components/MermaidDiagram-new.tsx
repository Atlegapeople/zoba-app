"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/components/theme-provider';
import { Loader2 } from 'lucide-react';

export type MermaidTheme = 'default' | 'forest' | 'dark' | 'neutral' | 'base';

interface MermaidDiagramProps {
  code: string;
  className?: string;
  mermaidTheme?: MermaidTheme;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, className = "", mermaidTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [svgContent, setSvgContent] = useState<string>('');
  
  // State for pan/zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const renderDiagram = useCallback(async () => {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      setError('No diagram code available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate a unique ID for this render
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, code);
      
      // Process the SVG to ensure it's responsive
      const processedSvg = svg.replace(/<svg /, '<svg style="width: 100%; height: 100%; max-height: 100%;" ');
      setSvgContent(processedSvg);
      setError(null);
    } catch (err) {
      console.error('Failed to render diagram:', err);
      setError('Failed to render diagram');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  // Initialize Mermaid with theme
  useEffect(() => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    mermaid.initialize({
      startOnLoad: true,
      theme: mermaidTheme || (isDark ? 'dark' : 'default'),
      fontFamily: 'var(--font-geist-sans)',
      themeVariables: mermaidTheme === 'base' ? {
        background: '#FAFAFF',
        mainBkg: '#FAFAFF',
        nodeBorder: '#273469',
        nodeBkg: '#FAFAFF',
        primaryTextColor: '#1B264F',
        secondaryTextColor: '#576490',
        lineColor: '#273469',
        arrowheadColor: '#273469',
        clusterBkg: '#E4D9FF',
        clusterBorder: '#273469',
        edgeLabelBackground: '#E4D9FF',
        nodeTextColor: '#1B264F',
        titleColor: '#1B264F',
        edgeColor: '#273469',
        labelTextColor: '#576490',
        labelBoxBkgColor: '#E4D9FF',
        labelBoxBorderColor: '#273469',
        fillColor: '#FAFAFF',
        tertiaryColor: '#FAFAFF'
      } : {},
      securityLevel: 'loose',
    });
  }, [theme, mermaidTheme]);

  // Render diagram when code changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 100); // Small delay to prevent rapid re-renders

    return () => clearTimeout(timeoutId);
  }, [renderDiagram]);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
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
    setScale(prevScale => Math.min(Math.max(prevScale + delta, 0.1), 3));
  }, []);

  // Handle zoom and pan events
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

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className={`${className} relative w-full h-full overflow-hidden bg-white dark:bg-[#1B264F]`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-delft-blue/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-delft-blue dark:text-periwinkle" />
            <span className="text-sm text-delft-blue dark:text-periwinkle">
              Rendering diagram...
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-red-500 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Diagram container */}
      <div 
        ref={containerRef}
        className="w-full h-full relative"
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* SVG container with transform */}
        <div
          ref={svgContainerRef}
          className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            opacity: isLoading ? 0 : 1,
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 bg-white/90 dark:bg-delft-blue/90 p-1 rounded-lg shadow-lg z-30">
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
    </div>
  );
}

export default MermaidDiagram;
