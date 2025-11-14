'use client';

import { Flame, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  onStartAction?: () => void;
}

export default function HeroSection({ onStartAction }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full" />
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <Flame className="w-16 h-16 text-red-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              OSP Commander
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              System wsparcia dla Kierujących Działaniem Ratowniczym
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Profesjonalne narzędzie do zarządzania akcjami ratowniczymi. 
            Gotowe checklisty, zarządzanie wyposażeniem i śledzenie postępu w czasie rzeczywistym.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto"
              onClick={onStartAction}
            >
              <Flame className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Rozpocznij nową akcję
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Link href="#features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium w-full sm:w-auto"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Dowiedz się więcej
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Działa offline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Responsywny design</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Darmowy i open-source</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

