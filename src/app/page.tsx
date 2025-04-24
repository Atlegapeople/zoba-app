"use client";

import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  // Uncomment the line below if you want to automatically redirect to the auth page
  // redirect('/auth');
  
  // Animation states
  const [loaded, setLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Set loaded state after component mounts for animations
  useEffect(() => {
    setLoaded(true);
    
    // Check for dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    
    // Listen for theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleThemeChange);
    
    return () => darkModeQuery.removeEventListener('change', handleThemeChange);
  }, []);
  
    
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden" 
      style={{ 
        backgroundColor: isDarkMode ? '#1a1c2e' : '#fafaff',
        transition: 'all 0.5s ease-in-out',
        backgroundImage: `radial-gradient(circle, ${isDarkMode ? 'rgba(228, 217, 255, 0.2)' : 'rgba(39, 52, 105, 0.2)'} 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }}>
      

      <div className="container mx-auto max-w-4xl flex flex-col items-center justify-center text-center z-10 relative">
        {/* Logo with shadow */}
        <div className="relative w-80 sm:w-96 h-64 sm:h-72 mb-0 transform transition-all duration-700 ease-out" 
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(-20px)',
          }}>
          <div className="relative h-full flex items-center justify-center">
            <Image 
              src="/images/logo-zoba.png" 
              alt="Zoba Logo" 
              width={400} 
              height={400}
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(8px 12px 12px rgba(39, 52, 105, 0.5)) drop-shadow(-2px -2px 6px rgba(228, 217, 255, 0.2))',
                objectFit: 'contain'
              }}
              priority
            />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 -mt-6 transition-all duration-700 ease-out text-center"
          style={{
            color: '#30343f',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            textShadow: '0 2px 4px rgba(39, 52, 105, 0.3), 0 0 2px rgba(255, 255, 255, 0.5)',
            fontFamily: 'var(--font-space-grotesk)',
            letterSpacing: '-0.5px'
          }}>
          Create Beautiful Diagrams
        </h1>
        
        <div className="mb-8 transition-all duration-700 delay-150 ease-out text-center w-full"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          }}>
          <p className="text-lg sm:text-xl mb-4 mx-auto" 
            style={{ 
              color: '#273469',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 600,
              letterSpacing: '-0.3px',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 0 1px rgba(39, 52, 105, 0.1)'
            }}>
            Zoba is a powerful diagram and chart generation tool
          </p>
          <p className="mb-2 mx-auto max-w-xl" style={{ 
              color: 'rgba(39, 52, 105, 0.8)',
              fontFamily: 'var(--font-geist-sans)',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.6), 0 0 1px rgba(39, 52, 105, 0.1)'
            }}>
            Create flowcharts, sequence diagrams, class diagrams, and more with our intuitive editor
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5 relative z-10 mx-auto">
            <span className="px-4 py-2 bg-periwinkle/30 text-delft-blue rounded-md text-sm font-mono cursor-pointer transition-all duration-300 hover:text-white hover:scale-105 hover:shadow-md relative overflow-hidden group shadow-sm" 
              style={{ fontFamily: 'var(--font-roboto-mono)', textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}>
              <span className="relative z-10 font-semibold">Flowcharts</span>
              <span className="absolute inset-0 bg-gradient-to-r from-periwinkle/70 to-delft-blue/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </span>
            <span className="px-4 py-2 bg-periwinkle/30 text-delft-blue rounded-md text-sm font-mono cursor-pointer transition-all duration-300 hover:text-white hover:scale-105 hover:shadow-md relative overflow-hidden group shadow-sm" 
              style={{ fontFamily: 'var(--font-roboto-mono)', textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}>
              <span className="relative z-10 font-semibold">Sequence Diagrams</span>
              <span className="absolute inset-0 bg-gradient-to-r from-periwinkle/60 to-delft-blue/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </span>
            <span className="px-4 py-2 bg-periwinkle/30 text-delft-blue rounded-md text-sm font-mono cursor-pointer transition-all duration-300 hover:text-white hover:scale-105 hover:shadow-md relative overflow-hidden group shadow-sm" 
              style={{ fontFamily: 'var(--font-roboto-mono)', textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}>
              <span className="relative z-10 font-semibold">Class Diagrams</span>
              <span className="absolute inset-0 bg-gradient-to-r from-delft-blue/60 to-periwinkle/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </span>
            <span className="px-4 py-2 bg-periwinkle/30 text-delft-blue rounded-md text-sm font-mono cursor-pointer transition-all duration-300 hover:text-white hover:scale-105 hover:shadow-md relative overflow-hidden group shadow-sm" 
              style={{ fontFamily: 'var(--font-roboto-mono)', textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}>
              <span className="relative z-10 font-semibold">Entity Relationships</span>
              <span className="absolute inset-0 bg-gradient-to-r from-periwinkle/70 to-delft-blue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 transition-all duration-700 delay-300 ease-out mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          }}>
          <Link 
            href="/auth" 
            className="px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:translate-y-[-2px]"
            style={{ 
              backgroundColor: '#273469', 
              color: '#fafaff',
              boxShadow: '0 4px 14px rgba(39, 52, 105, 0.4)'
            }}
          >
            <span style={{ fontFamily: 'var(--font-roboto-mono)', letterSpacing: '-0.5px' }}>Start Diagramming</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
