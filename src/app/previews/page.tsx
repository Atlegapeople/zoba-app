'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MermaidDiagram from '@/components/MermaidDiagram';
import Link from 'next/link';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

interface SavedDiagram {
  _id: string;
  name: string;
  code: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function PreviewsPage() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/diagrams')
      .then(res => res.json())
      .then(data => setDiagrams(data));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Diagram Previews</h1>
        <Link href="/dashboard">
          <Button className="flex items-center gap-2">
            <PlusCircle size={20} />
            Create New Diagram
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="h-[200px] w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : diagrams.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">No diagrams yet</h2>
          <p className="text-gray-500 mb-6">Create your first diagram to get started</p>
          <Link href="/dashboard">
            <Button className="flex items-center gap-2">
              <PlusCircle size={20} />
              Create New Diagram
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagrams.map((diagram) => (
            <Card key={diagram._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative h-[200px] overflow-hidden mb-4 bg-white rounded border">
                  <div className="absolute inset-0">
                    <MermaidDiagram code={diagram.code || ''} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">{diagram.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 