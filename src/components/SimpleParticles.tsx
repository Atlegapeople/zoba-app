'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const SimpleParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Simple particles
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      particles = [];
      const particleCount = 50; // Keep count low for performance
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2 + Math.random() * 3, // Small dots
          speedX: (Math.random() - 0.5) * 0.5, // Slow movement
          speedY: (Math.random() - 0.5) * 0.5
        });
      }
    };

    // Draw function
    const draw = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set particle color based on theme
      const isDark = resolvedTheme === 'dark';
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
      
      // Draw each particle
      particles.forEach(particle => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw the particle as a simple circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };

    // Initialize
    setCanvasSize();
    createParticles();
    draw();
    
    // Handle resize
    window.addEventListener('resize', () => {
      setCanvasSize();
      createParticles();
    });
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default SimpleParticles;
