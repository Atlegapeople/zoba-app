"use client";

import { useState, useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';

interface DiagramExportImportProps {
  currentCode: string;
  onImport: (code: string) => void;
  diagramName?: string;
}

export default function DiagramExportImport({
  currentCode,
  onImport,
  diagramName = "Diagram"
}: DiagramExportImportProps) {
  const [exportFormat, setExportFormat] = useState<'svg' | 'png' | 'pdf'>('svg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = async () => {
    // In a real app, this would call a server endpoint to generate the export
    // For now, we'll just download the code as a .mmd file
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName.replace(/\s+/g, '-').toLowerCase()}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-64 border border-gray-200 dark:border-gray-700 z-50">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export Diagram</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Export Format
                </label>
                <select 
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'svg' | 'png' | 'pdf')}
                >
                  <option value="svg">SVG</option>
                  <option value="png">PNG</option>
                  <option value="pdf">PDF</option>
                  <option value="mmd">Mermaid (.mmd)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diagram Name
                </label>
                <input 
                  type="text" 
                  defaultValue={diagramName}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>
              
              <button 
                onClick={handleExport}
                className="w-full bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Download
              </button>
            </div>
            <Popover.Arrow className="fill-white dark:fill-gray-800" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      
      <button 
        onClick={handleImportClick}
        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        Import
      </button>
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept=".mmd,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
}
