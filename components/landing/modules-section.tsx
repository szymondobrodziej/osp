'use client';

import { FileText, Truck, Flame } from 'lucide-react';
import ModuleCard from './module-card';
import ScrollReveal from './scroll-reveal';

export default function ModulesSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Główne moduły
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Wszystko czego potrzebujesz do profesjonalnego zarządzania akcją ratowniczą
            </p>
          </div>
        </ScrollReveal>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <ScrollReveal delay={100}>
            <ModuleCard
              icon={FileText}
              title="Checklisty"
              description="Gotowe procedury dla każdego typu zdarzenia. Śledź postęp i nie pomiń żadnego kroku."
              href="/checklists"
              buttonText="Przeglądaj checklisty"
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <ModuleCard
              icon={Truck}
              title="Wyposażenie pojazdu"
              description="Zarządzaj sprzętem w pojeździe. Wizualizacja rozmieszczenia i kontrola dat ważności."
              href="/vehicle-equipment"
              buttonText="Zobacz wyposażenie"
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
            />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <ModuleCard
              icon={Flame}
              title="Zdarzenia"
              description="Rozpocznij nową akcję ratowniczą z automatycznymi checklistami i dokumentacją."
              href="#start"
              buttonText="Rozpocznij akcję"
              iconColor="text-red-600"
              iconBgColor="bg-red-50"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

