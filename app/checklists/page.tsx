'use client';

import { ChecklistLibrary } from '@/components/checklist-library';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChecklistsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do strony głównej
          </Button>
        </Link>
        
        <ChecklistLibrary />
      </div>
    </div>
  );
}

