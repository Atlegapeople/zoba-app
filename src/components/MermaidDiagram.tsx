"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/components/theme-provider';

// Available Mermaid themes
export type MermaidTheme = 'default' | 'forest' | 'dark' | 'neutral' | 'base';

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
          }
          return;
        }

        mermaid.render('mermaid-diagram', code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        }).catch((error) => {
          console.error('Failed to render diagram:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full w-full text-red-400">
                <p>Failed to render diagram</p>
              </div>
            `;
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
      theme: mermaidTheme,
      fontFamily: 'var(--font-mono)',
      themeVariables: mermaidTheme === 'base' ? {
        background: '#FAFAFF',      // Ghost White
        mainBkg: '#FAFAFF',        // Ghost White
        nodeBorder: '#273469',     // Delft Blue
        nodeBkg: '#FAFAFF',        // Ghost White
        primaryTextColor: '#1B264F', // Space Cadet
        secondaryTextColor: '#576490', // Gunmetal
        lineColor: '#273469',      // Delft Blue
        arrowheadColor: '#273469', // Delft Blue
        clusterBkg: '#E4D9FF',     // Periwinkle
        clusterBorder: '#273469',  // Delft Blue
        edgeLabelBackground: '#E4D9FF', // Periwinkle
        // Additional settings to ensure consistency
        nodeTextColor: '#1B264F',  // Space Cadet
        titleColor: '#1B264F',     // Space Cadet
        edgeColor: '#273469',      // Delft Blue
        labelTextColor: '#576490', // Gunmetal
        labelBoxBkgColor: '#E4D9FF', // Periwinkle
        labelBoxBorderColor: '#273469', // Delft Blue
        labelTextSize: '10px',
        // Force node colors
        fillColor: '#FAFAFF',      // Ghost White for node fill
        tertiaryColor: '#FAFAFF'   // Ghost White for any remaining backgrounds
      } : {}
    };

    mermaid.initialize(themeConfig);

    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
    }
  }, [code, theme, mermaidTheme]);

  // Render the mermaid diagram
  const renderDiagram = useCallback(async () => {
    if (!containerRef.current) return;
    
    // Clear previous content and error
    containerRef.current.innerHTML = '';
    setError(null);
    setIsRendered(false); // Reset rendered state
    
    try {
      // Handle empty chart content
      if (!code || code.trim() === '') {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full w-full text-gray-400">
            <p>Start typing in the editor to create a diagram.</p>
          </div>
        `;
        return;
      }

      const zobaTheme = {
        // Base colors and typography
        background: '#FAFAFF',      // Ghost White
        mainBkg: '#FAFAFF',        // Ghost White
        primaryTextColor: '#1B264F', // Space Cadet
        secondaryTextColor: '#576490', // Gunmetal
        tertiaryColor: '#FAFAFF',   // Ghost White
        fontFamily: 'var(--font-geist-sans)',
        fontSize: '16px',

        // Node and edge colors (used across multiple diagrams)
        nodeBorder: '#273469',     // Delft Blue
        nodeBkg: '#FAFAFF',        // Ghost White
        nodeTextColor: '#1B264F',  // Space Cadet
        lineColor: '#273469',      // Delft Blue
        edgeColor: '#273469',      // Delft Blue
        arrowheadColor: '#273469', // Delft Blue
        
        // Labels and text (universal)
        labelTextColor: '#576490', // Gunmetal
        labelBoxBkgColor: '#E4D9FF', // Periwinkle
        labelBoxBorderColor: '#273469', // Delft Blue
        titleColor: '#1B264F',     // Space Cadet

        // Flowchart specific
        flowchartBorder: '#273469', // Delft Blue
        flowchartBkg: '#FAFAFF',    // Ghost White
        
        // Sequence diagram
        actorBorder: '#273469',     // Delft Blue
        actorBkg: '#FAFAFF',        // Ghost White
        actorTextColor: '#1B264F',  // Space Cadet
        actorLineColor: '#273469',  // Delft Blue
        signalColor: '#273469',     // Delft Blue
        signalTextColor: '#1B264F', // Space Cadet
        loopTextColor: '#576490',   // Gunmetal
        activationBorderColor: '#273469', // Delft Blue
        activationBkgColor: '#E4D9FF',    // Periwinkle
        sequenceNumberColor: '#576490',    // Gunmetal

        // Class diagram
        classText: '#1B264F',      // Space Cadet
        classBorder: '#273469',    // Delft Blue
        classFillColor: '#FAFAFF', // Ghost White
        
        // State diagram
        stateBorder: '#273469',    // Delft Blue
        stateBkg: '#FAFAFF',       // Ghost White
        stateTextColor: '#1B264F', // Space Cadet
        transitionColor: '#273469', // Delft Blue
        transitionLabelColor: '#576490', // Gunmetal
        stateLabelColor: '#1B264F', // Space Cadet
        
        // Gantt chart
        ganttBkg: '#FAFAFF',       // Ghost White
        taskBkg: '#E4D9FF',        // Periwinkle
        taskBorderColor: '#273469', // Delft Blue
        activeTaskBorderColor: '#273469', // Delft Blue
        activeTaskBkgColor: '#E4D9FF', // Periwinkle
        gridColor: '#576490',      // Gunmetal
        doneTaskBkgColor: '#273469', // Delft Blue
        doneTaskBorderColor: '#1B264F', // Space Cadet
        critBorderColor: '#273469', // Delft Blue
        critBkgColor: '#E4D9FF',   // Periwinkle
        todayLineColor: '#273469', // Delft Blue
        sectionBkgColor: '#FAFAFF', // Ghost White
        altSectionBkgColor: '#F5F5FF', // Slightly different Ghost White
        taskTextColor: '#1B264F',  // Space Cadet
        taskTextOutsideColor: '#576490', // Gunmetal
        taskTextLightColor: '#1B264F', // Space Cadet
        
        // Pie chart
        pie1: '#273469',           // Delft Blue
        pie2: '#E4D9FF',           // Periwinkle
        pie3: '#576490',           // Gunmetal
        pie4: '#1B264F',           // Space Cadet
        pie5: '#8B95C9',           // Muted Blue
        pie6: '#9BA3EB',           // Light Blue
        pie7: '#ADB5E7',           // Soft Blue
        pie8: '#CAC4CE',           // Light Gray
        pieTitleTextSize: '25px',
        pieTitleTextColor: '#1B264F', // Space Cadet
        pieSectionTextColor: '#1B264F', // Space Cadet
        pieSectionTextSize: '17px',
        
        // ER diagram
        entityBorder: '#273469',   // Delft Blue
        entityBkg: '#FAFAFF',      // Ghost White
        entityTextColor: '#1B264F', // Space Cadet
        attributeBoxBorder: '#273469', // Delft Blue
        attributeBoxBkg: '#E4D9FF', // Periwinkle
        
        // Git graph
        gitInv0: '#273469',        // Delft Blue
        gitInv1: '#E4D9FF',        // Periwinkle
        gitInv2: '#576490',        // Gunmetal
        gitInv3: '#1B264F',        // Space Cadet
        gitInv4: '#8B95C9',        // Muted Blue
        commitLabelColor: '#1B264F', // Space Cadet
        commitLabelBackground: '#E4D9FF', // Periwinkle
        
        // Journey diagram
        journeyBorder: '#273469',  // Delft Blue
        journeyBkg: '#FAFAFF',     // Ghost White
        journeyTextColor: '#1B264F', // Space Cadet
        
        // Mindmap
        mindmapBorder: '#273469',  // Delft Blue
        mindmapBkg: '#FAFAFF',     // Ghost White
        mindmapTextColor: '#1B264F', // Space Cadet
        
        // Timeline
        timelineBorder: '#273469', // Delft Blue
        timelineBkg: '#FAFAFF',    // Ghost White
        timelineTextColor: '#1B264F', // Space Cadet
        
        // Quadrant chart
        quadrant1Fill: '#273469',  // Delft Blue
        quadrant2Fill: '#E4D9FF',  // Periwinkle
        quadrant3Fill: '#576490',  // Gunmetal
        quadrant4Fill: '#1B264F',  // Space Cadet
        quadrantPointFill: '#273469', // Delft Blue
        quadrantPointTextColor: '#1B264F', // Space Cadet
        
        // C4 diagrams
        c4Border: '#273469',       // Delft Blue
        c4BoundaryBorder: '#273469', // Delft Blue
        c4ContainerBorder: '#273469', // Delft Blue
        c4ComponentBorder: '#273469', // Delft Blue
        c4PersonBorder: '#273469', // Delft Blue
        c4DatabaseBorder: '#273469', // Delft Blue
        
        // Requirement diagram
        requirementBorder: '#273469', // Delft Blue
        requirementBkg: '#FAFAFF',  // Ghost White
        requirementTextColor: '#1B264F', // Space Cadet
        
        // Common styling
        clusterBkg: '#E4D9FF',     // Periwinkle
        clusterBorder: '#273469',  // Delft Blue
        fillColor: '#FAFAFF',      // Ghost White
        
        // Additional settings
        darkMode: false,
        noteTextColor: '#1B264F',  // Space Cadet
        noteBorderColor: '#273469', // Delft Blue
        noteBkgColor: '#E4D9FF',   // Periwinkle
        
        // Styling configuration
        numberSectionStyles: 4,
        curve: 'basis',
        useMaxWidth: false
      };
      
      // Initialize mermaid with settings and selected theme
      mermaid.initialize({
        startOnLoad: false,
        theme: mermaidTheme === 'base' ? 'base' : mermaidTheme,
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
        },
        themeVariables: mermaidTheme === 'base' ? zobaTheme : {}
      });
      
      // Create a unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, code);
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Insert the new SVG
      containerRef.current.innerHTML = svg;

      // Post-process the SVG to ensure theme is applied
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement && mermaidTheme === 'base') {
        // Add filter definition for the glow effect if it doesn't exist
        const defs = svgElement.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filterId = 'glow-effect';
        if (!svgElement.querySelector(`#${filterId}`)) {
          const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
          filter.setAttribute('id', filterId);
          filter.innerHTML = `
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          `;
          defs.appendChild(filter);
          if (!svgElement.querySelector('defs')) {
            svgElement.insertBefore(defs, svgElement.firstChild);
          }
        }

        // Apply styles to all diagram types
        const applyGlowAndColors = (selector: string) => {
          const elements = svgElement.querySelectorAll(selector);
          elements.forEach(element => {
            (element as SVGElement).style.fill = '#FAFAFF';
            (element as SVGElement).style.stroke = '#273469';
            (element as SVGElement).style.strokeWidth = '2px';
            (element as SVGElement).style.filter = 'url(#glow-effect)';
          });
        };

        // Flowchart nodes
        applyGlowAndColors('.node rect, .node circle, .node polygon, .node path');
        
        // Class diagram
        applyGlowAndColors('.classGroup rect');
        
        // State diagram
        applyGlowAndColors('.stateGroup rect, .stateGroup circle');
        
        // ER diagram
        applyGlowAndColors('.entityBox');
        
        // Sequence diagram
        applyGlowAndColors('.actor > rect, .actor > circle, .activation0, .actor-box rect, rect.actor, .messageLine0, .messageLine1');
        
        // Additional sequence diagram elements
        const sequenceElements = svgElement.querySelectorAll('.actor, .messageText');
        sequenceElements.forEach(element => {
          // Ensure actor boxes have glow
          const rects = element.querySelectorAll('rect');
          rects.forEach(rect => {
            (rect as SVGElement).style.fill = '#FAFAFF';
            (rect as SVGElement).style.stroke = '#273469';
            (rect as SVGElement).style.strokeWidth = '2px';
            (rect as SVGElement).style.filter = 'url(#glow-effect)';
          });
        });

        // Enhance sequence diagram lines with stronger styling
        const sequenceLines = svgElement.querySelectorAll('.messageLine0, .messageLine1, .loopLine, .note, line, .actor-line, path[class^="message"], .messageLine');
        sequenceLines.forEach(line => {
          (line as SVGElement).style.stroke = '#273469';
          (line as SVGElement).style.strokeWidth = '2.5px';
          // Make dashed lines more visible
          if ((line as SVGElement).classList.contains('messageLine1')) {
            (line as SVGElement).style.strokeDasharray = '6 3';
            (line as SVGElement).style.strokeWidth = '2.5px';
          }
        });

        // Ensure vertical lifelines are more visible
        const lifelines = svgElement.querySelectorAll('.actor + line, line.actor-line');
        lifelines.forEach(line => {
          (line as SVGElement).style.stroke = '#273469';
          (line as SVGElement).style.strokeWidth = '1.5px';
          (line as SVGElement).style.strokeDasharray = '6 3';
          (line as SVGElement).style.opacity = '0.8'; // Make lifelines slightly more visible
        });

        // Enhance arrowheads
        const arrowheads = svgElement.querySelectorAll('.messageEnd, .arrowhead, marker[id^="arrowhead"], path[id^="arrowhead"]');
        arrowheads.forEach(arrow => {
          (arrow as SVGElement).style.fill = '#273469';
          (arrow as SVGElement).style.stroke = '#273469';
          (arrow as SVGElement).style.strokeWidth = '2.5px';
        });

        // Force all message paths to be visible
        const messagePaths = svgElement.querySelectorAll('path[class*="message"], .message');
        messagePaths.forEach(path => {
          (path as SVGElement).style.stroke = '#273469';
          (path as SVGElement).style.strokeWidth = '2.5px';
          (path as SVGElement).style.fill = 'none';
        });

        // Ensure all lines are visible with stronger styling
        const allLines = svgElement.querySelectorAll('line, path');
        allLines.forEach(line => {
          if (!(line as SVGElement).style.stroke) {
            (line as SVGElement).style.stroke = '#273469';
            (line as SVGElement).style.strokeWidth = '2.5px';
          }
        });
        
        // Gantt chart tasks
        applyGlowAndColors('.task');
        
        // Git graph commits
        applyGlowAndColors('.commit-bullets circle, .branch-label');
        
        // Journey diagram
        applyGlowAndColors('.journey-section rect');
        
        // Mindmap nodes
        applyGlowAndColors('.mindmap-node > rect, .mindmap-node > circle');
        
        // Timeline events
        applyGlowAndColors('.timeline-event > rect');
        
        // Quadrant chart
        applyGlowAndColors('.quadrant-point-rect');
        
        // C4 diagram
        applyGlowAndColors('.person rect, .system rect, .container rect, .component rect, .database rect');
        
        // Requirement diagram
        applyGlowAndColors('.requirement-rect');

        // Common elements across diagrams
        applyGlowAndColors('.cluster rect, .note rect, .labelBox');

        // Edge styling
        const edges = svgElement.querySelectorAll('.edge path, .edge polygon');
        edges.forEach(edge => {
          (edge as SVGElement).style.stroke = '#273469';
          (edge as SVGElement).style.strokeWidth = '2px';
        });

        // Label styling
        const labels = svgElement.querySelectorAll('.edgeLabel rect');
        labels.forEach(label => {
          (label as SVGElement).style.fill = '#E4D9FF';
          (label as SVGElement).style.stroke = '#273469';
        });
      }

      // Fix SVG element styling
      if (svgElement && gridRef.current) {
        // Set dimensions
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        
        // Get all elements in the SVG to calculate total dimensions
        const allElements = svgElement.querySelectorAll('*');
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        // Examine all elements to find true diagram bounds
        allElements.forEach((el) => {
          try {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              minX = Math.min(minX, rect.left);
              minY = Math.min(minY, rect.top);
              maxX = Math.max(maxX, rect.right);
              maxY = Math.max(maxY, rect.bottom);
            }
          } catch (e) {
            // Ignore errors from elements that don't support getBoundingClientRect
          }
        });
        
        // Calculate total content width/height
        const svgRect = svgElement.getBoundingClientRect();
        const contentWidth = maxX - minX || svgRect.width || 800;
        const contentHeight = maxY - minY || svgRect.height || 600;
        
        // Get container dimensions
        const containerWidth = gridRef.current.clientWidth;
        const containerHeight = gridRef.current.clientHeight;
        
        // Calculate better scale to fit container while leaving room for borders
        const scaleX = (containerWidth * 0.85) / contentWidth;
        const scaleY = (containerHeight * 0.85) / contentHeight;
        const newScale = Math.min(scaleX, scaleY, 1.2);
        
        // Center calculation with no offset
        const centerX = (containerWidth - (contentWidth * newScale)) / 2;
        const centerY = (containerHeight - (contentHeight * newScale)) / 2;

        // Apply transform immediately
        if (svgElement) {
          // Hide SVG initially
          svgElement.style.setProperty('opacity', '0', 'important');
          svgElement.style.setProperty('transition', 'opacity 0.2s ease-in-out', 'important');
          
          svgElement.style.setProperty('transform-origin', '50% 50%', 'important');
          svgElement.style.setProperty('transform', `translate(${centerX}px, ${centerY}px) scale(${newScale})`, 'important');
          
          // Set viewBox to ensure proper centering
          const viewBox = `0 0 ${contentWidth} ${contentHeight}`;
          svgElement.setAttribute('viewBox', viewBox);
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
          
          // Ensure SVG takes up full space
          svgElement.style.setProperty('width', '100%', 'important');
          svgElement.style.setProperty('height', '100%', 'important');
          svgElement.style.setProperty('position', 'absolute', 'important');
          svgElement.style.setProperty('left', '0', 'important');
          svgElement.style.setProperty('top', '0', 'important');

          // Set scale and position
          setScale(newScale);
          setPosition({ x: centerX, y: centerY });

          // Show SVG after a brief delay to ensure positioning is complete
          requestAnimationFrame(() => {
            svgElement.style.setProperty('opacity', '1', 'important');
            setIsRendered(true);
          });
        }
      }
    } catch (error) {
      console.error('Failed to render diagram:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsRendered(true); // Show error message
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg text-red-700 dark:text-red-300 max-w-md mx-auto opacity-0 transition-opacity duration-200">
            <h3 class="font-bold text-lg mb-2">Diagram Error</h3>
            <p class="mb-2">${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p>Check your diagram syntax and try again.</p>
          </div>
        `;
        
        // Show error after a brief delay
        requestAnimationFrame(() => {
          const errorDiv = containerRef.current?.querySelector('div');
          if (errorDiv) {
            errorDiv.style.opacity = '1';
          }
        });
      }
    }
  }, [code, theme, mermaidTheme]);

  // Render on mount and when chart or theme changes
  useEffect(() => {
    // Force a complete re-render when the chart or theme changes
    if (containerRef.current) {
      // Clear previous content first
      containerRef.current.innerHTML = '';
    }
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      renderDiagram();
    }, 10);

    // Cleanup function
    return () => {
      // Reset the scale and position
      setScale(1);
      setPosition({ x: 0, y: 0 });
    };
  }, [code, theme, mermaidTheme, renderDiagram]);

  // Resize observer to handle container changes
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      renderDiagram();
    });
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => observer.disconnect();
  }, [renderDiagram]);

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
    renderDiagram();
  }, [renderDiagram]);

  return (
    <div className={`${className} relative w-full h-full overflow-hidden bg-white dark:bg-[#1B264F]`}>
      {/* Background div with gridRef */}
      <div 
        ref={gridRef}
        className="absolute inset-0 bg-white dark:bg-[#1B264F]" 
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
        className="w-full h-full flex items-center justify-center relative"
        onMouseDown={handleMouseDown}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          overflow: 'hidden',
          opacity: isRendered ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <div 
          ref={containerRef} 
          className="w-full h-full absolute inset-0 flex items-center justify-center" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
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