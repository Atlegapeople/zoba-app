'use client';

import React from 'react';

const MermaidBackground = () => {
  // Simple test with a vibrant background to confirm component is rendering
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-red-500">
      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
        BACKGROUND TEST
      </div>
      <div className="absolute top-0 left-0 border-8 border-yellow-500 w-full h-full"></div>
    </div>
  );
};

export default MermaidBackground;
