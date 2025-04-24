'use client';

import React from 'react';

// No canvas, no complicated effects, just basic CSS
const SimpleBackground = () => {
  return (
    <>
      {/* Absolute positioned background with visible dots */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle, black 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: -1,
          opacity: 0.2
        }}
      />
      
      {/* Debug banner to confirm this component is rendering */}
      <div 
        className="fixed top-0 left-0 bg-red-500 text-white p-2 z-50 text-sm"
        style={{ zIndex: 9999 }}
      >
        BACKGROUND IS ACTIVE
      </div>
    </>
  );
};

export default SimpleBackground;
