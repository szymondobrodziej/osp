'use client';

import { Flame, Truck, FolderOpen, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const quickActions = [
  {
    icon: Flame,
    title: 'Rozpocznij akcję ratowniczą',
    description: 'Natychmiastowe rozpoczęcie nowego zdarzenia z gotowymi checklistami',
    href: '#start',
    color: 'text-red-600',
  },
  {
    icon: Truck,
    title: 'Zobacz wyposażenie pojazdu',
    description: 'Przeglądaj i zarządzaj sprzętem w pojeździe ratowniczym',
    href: '/vehicle-equipment',
    color: 'text-orange-600',
  },
  {
    icon: FolderOpen,
    title: 'Przeglądaj bibliotekę checklistów',
    description: 'Dostęp do gotowych procedur dla różnych typów zdarzeń',
    href: '/checklists',
    color: 'text-blue-600',
  },
  {
    icon: Settings,
    title: 'Zarządzaj szablonami',
    description: 'Twórz i edytuj własne szablony checklistów',
    href: '/checklists',
    color: 'text-gray-600',
  },
];

export default function QuickActions() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Szybkie akcje
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Najczęściej używane funkcje w zasięgu jednego kliknięcia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group block"
            >
              <Card className="h-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <action.icon className={`w-6 h-6 ${action.color}`} strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

