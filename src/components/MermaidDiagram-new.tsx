"use client";

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/components/theme-provider';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  // Process and enhance SVG after rendering
  const processAndEnhanceSVG = () => {
    if (!containerRef.current) return;
    
    const svgElement = containerRef.current.querySelector('svg') as SVGSVGElement;
    if (!svgElement) return;
    
    // Make the SVG responsive
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    svgElement.style.maxWidth = '100%';
    svgElement.style.maxHeight = '100%';
    svgElement.style.overflow = 'visible';
    
    // Get the root group element
    const g = svgElement.querySelector('g');
    if (!g) return;
    
    // Get content and container dimensions
    const contentBBox = g.getBBox ? g.getBBox() : { width: 800, height: 600 };
    const containerWidth = containerRef.current.clientWidth - 32; // Adjust for padding
    const containerHeight = containerRef.current.clientHeight - 32; // Adjust for padding
    
    // Calculate appropriate scaling
    let scaleX = (containerWidth * 0.95) / contentBBox.width;
    let scaleY = (containerHeight * 0.92) / contentBBox.height;
    let scale = Math.min(scaleX, scaleY);
    
    // Ensure diagrams are appropriately sized
    if (contentBBox.width < 600) {
      scale = Math.max(scale, 1.1); // Scale up small diagrams
    } else {
      scale = Math.max(scale, 0.8); // Ensure minimum scale for large diagrams
    }
    
    // Apply transform
    g.style.transform = `scale(${scale})`;
    g.style.transformOrigin = 'center';
    
    // Style rectangles
    const rects = svgElement.querySelectorAll('rect:not(.label-container)');
    rects.forEach((rect) => {
      if (!rect.getAttribute('fill') || rect.getAttribute('fill') === 'none') {
        rect.setAttribute('fill', theme === 'dark' ? '#4c566a' : '#e6f0ff');
        rect.setAttribute('fill-opacity', '0.8');
        rect.setAttribute('rx', '4'); // Rounded corners
        rect.setAttribute('ry', '4');
      }
    });
    
    // Style text elements
    const textElements = svgElement.querySelectorAll('text');
    textElements.forEach((text) => {
      text.style.fontFamily = 'Segoe UI, system-ui, -apple-system, sans-serif';
      text.style.fontSize = '17px';
      text.style.fontWeight = '500';
    });
    
    // Style paths/lines
    const pathElements = svgElement.querySelectorAll('path');
    pathElements.forEach((path) => {
      if (path.getAttribute('stroke-width') === '0') {
        path.setAttribute('stroke-width', '1.5');
      }
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-linecap', 'round');
    });
    
    // Adjust node sizes to fit text
    adjustNodeSizesToFitText(svgElement);
  };
  
  // Function to adjust node sizes to fit text
  const adjustNodeSizesToFitText = (svgElement: SVGSVGElement) => {
    const nodes = svgElement.querySelectorAll('.node');
    const nodeCount = nodes.length;
    const isComplexDiagram = nodeCount > 15;
    
    // Define size constraints
    const minNodeWidth = isComplexDiagram ? 120 : 150;
    const maxNodeWidth = isComplexDiagram ? 200 : 250;
    const minNodeHeight = isComplexDiagram ? 40 : 50;
    const maxNodeHeight = isComplexDiagram ? 70 : 90;
    
    nodes.forEach((node) => {
      const rect = node.querySelector('rect');
      const texts = node.querySelectorAll('text');
      
      if (rect) {
        let width = parseInt(rect.getAttribute('width') || '0');
        let height = parseInt(rect.getAttribute('height') || '0');
        let needsResize = false;
        let requiredWidth = minNodeWidth;
        let requiredHeight = minNodeHeight;
        
        texts.forEach((text) => {
          // Roughly calculate the text width
          const textContent = text.textContent || '';
          const estimatedWidth = textContent.length * 9; // Rough estimate based on font size
          
          if (estimatedWidth > requiredWidth) {
            requiredWidth = Math.min(estimatedWidth + 20, maxNodeWidth); // Add padding
            needsResize = true;
          }
          
          // If multiple lines of text, increase height
          if (texts.length > 1) {
            requiredHeight = Math.min(texts.length * 25 + 10, maxNodeHeight);
            needsResize = true;
          }
        });
        
        // Apply new dimensions if needed
        if (needsResize || width < minNodeWidth || height < minNodeHeight) {
          rect.setAttribute('width', String(Math.max(width, requiredWidth)));
          rect.setAttribute('height', String(Math.max(height, requiredHeight)));
          
          // Center the text vertically if we resized and only have one text element
          texts.forEach((text) => {
            if (texts.length === 1) {
              const newHeight = Math.max(height, requiredHeight);
              text.setAttribute('y', String(newHeight / 2 + 5)); // +5 for slight offset
            }
          });
        }
      }
    });
  };
  
  // Render the Mermaid diagram
  const renderDiagram = async () => {
    if (!containerRef.current) return;
    
    try {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Initialize mermaid with optimized settings
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
        fontSize: 18, // Larger font size
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
          nodeSpacing: 30,
          rankSpacing: 60,
          padding: 10,
          diagramPadding: 10
        },
        themeVariables: {
          fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
          fontSize: '18px',
          primaryColor: theme === 'dark' ? '#88c0d0' : '#5c7cfa',
          primaryTextColor: theme === 'dark' ? '#eceff4' : '#343a40',
          secondaryColor: theme === 'dark' ? '#434c5e' : '#e9ecef',
          lineColor: theme === 'dark' ? '#88c0d0' : '#5c7cfa'
        }
      });
      
      // Create a unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      
      // Use mermaid API to render
      const { svg } = await mermaid.render(id, chart);
      
      // Insert the SVG into the container
      containerRef.current.innerHTML = svg;
      
      // Process and enhance the SVG after rendering
      processAndEnhanceSVG();
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error('Failed to render mermaid diagram:', error);
      
      // Set error state
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      
      // Display error message in container
      if (containerRef.current) {
        const helpfulMessage = errorMessage.includes('Diagram type not specified') ?
          'Make sure your diagram starts with a diagram type like "flowchart TD" or "sequenceDiagram"' :
          'Please check your syntax. Common issues include missing connections or invalid syntax.';
        
        containerRef.current.innerHTML = `
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300">
            <h3 class="font-bold mb-2">Diagram Error</h3>
            <p class="mb-2">${errorMessage}</p>
            <p class="text-sm">${helpfulMessage}</p>
            <p class="text-xs mt-3">Example: flowchart TD\nA[Start] --> B[End]</p>
          </div>
        `;
      }
    }
  };
  
  // Add a resize observer to make the diagram responsive
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    
    if (containerRef.current) {
      // Create a resize observer to handle container size changes
      resizeObserver = new ResizeObserver(() => {
        renderDiagram();
      });
      
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  
  // Listen for window resize events for additional responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        processAndEnhanceSVG();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initial render and re-render when dependencies change
  useEffect(() => {
    renderDiagram();
  }, [chart, theme]);

  return (
    <div className={`${className} w-full h-full overflow-hidden relative`}>
      {/* Dotted grid background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
          pointerEvents: 'none' // Allow clicking through the grid
        }}
      />
      
      {/* Diagram container with transparent background */}
      <div 
        ref={containerRef} 
        className="w-full h-full flex justify-center items-center z-10 relative" 
        style={{
          padding: '16px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'transparent',
          borderRadius: '8px',
          width: '100%',
          height: '100%',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
}
