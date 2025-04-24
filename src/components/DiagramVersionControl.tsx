"use client";

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

interface DiagramVersion {
  id: string;
  name: string;
  timestamp: string;
  author: string;
  content: string;
}

interface DiagramVersionControlProps {
  currentCode: string;
  onVersionSelect: (code: string) => void;
}

export default function DiagramVersionControl({ 
  currentCode, 
  onVersionSelect 
}: DiagramVersionControlProps) {
  // In a real SaaS app, these would come from an API
  const [versions, setVersions] = useState<DiagramVersion[]>([
    {
      id: '1',
      name: 'Initial version',
      timestamp: new Date().toISOString(),
      author: 'You',
      content: currentCode,
    },
  ]);
  
  const [showVersions, setShowVersions] = useState(false);
  
  const saveVersion = () => {
    const newVersion: DiagramVersion = {
      id: (versions.length + 1).toString(),
      name: `Version ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      author: 'You',
      content: currentCode,
    };
    
    setVersions([...versions, newVersion]);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Version History
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700 z-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Version History</h3>
              <button 
                onClick={saveVersion}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Current
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {versions.map((version) => (
                <div 
                  key={version.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer mb-1"
                  onClick={() => onVersionSelect(version.content)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{version.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(version.timestamp)}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">By {version.author}</div>
                </div>
              ))}
            </div>
            <Popover.Arrow className="fill-white dark:fill-gray-800" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Share
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700 z-50">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Share Diagram</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collaboration Link
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    value="https://zoba.app/d/share/abc123" 
                    readOnly
                    className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <button className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-r-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500">
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invite Collaborators
                </label>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Email address"
                    className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                  <button className="bg-blue-600 px-3 py-2 rounded-r-md text-white hover:bg-blue-700">
                    Invite
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Permission Settings
                </label>
                <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white">
                  <option value="view">Can view</option>
                  <option value="comment">Can comment</option>
                  <option value="edit">Can edit</option>
                </select>
              </div>
            </div>
            <Popover.Arrow className="fill-white dark:fill-gray-800" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
