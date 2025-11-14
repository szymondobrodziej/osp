'use client';

import {
  CheckCircle2,
  Smartphone,
  Wifi,
  Clock,
  Shield,
  Zap,
  FileText,
  Truck,
  Users,
  Map,
  Camera,
  Download,
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Gotowe checklisty',
    description: 'Procedury dla każdego typu zdarzenia - pożary, wypadki, zagrożenia chemiczne i więcej',
  },
  {
    icon: Truck,
    title: 'Zarządzanie wyposażeniem',
    description: 'Kompletna inwentaryzacja sprzętu w pojeździe z wizualizacją rozmieszczenia',
  },
  {
    icon: Clock,
    title: 'Śledzenie w czasie rzeczywistym',
    description: 'Monitoruj postęp akcji, status zadań i wykorzystanie zasobów na bieżąco',
  },
  {
    icon: Wifi,
    title: 'Offline-first',
    description: 'Pełna funkcjonalność bez połączenia z internetem - dane zapisywane lokalnie',
  },
  {
    icon: Smartphone,
    title: 'Responsywny design',
    description: 'Działa na każdym urządzeniu - telefon, tablet, laptop, desktop',
  },
  {
    icon: Zap,
    title: 'Szybki start',
    description: 'Rozpocznij akcję w kilka sekund - bez zbędnych formularzy i komplikacji',
  },
  {
    icon: FileText,
    title: 'Własne szablony',
    description: 'Twórz i dostosowuj checklisty do specyfiki swojej jednostki',
  },
  {
    icon: Map,
    title: 'Mapy i lokalizacja',
    description: 'Integracja z mapami, oznaczanie hydrantów i źródeł wody',
  },
  {
    icon: Users,
    title: 'Zarządzanie zespołem',
    description: 'Przypisuj zadania, śledź poszkodowanych i zasoby ludzkie',
  },
  {
    icon: Camera,
    title: 'Dokumentacja zdjęciowa',
    description: 'Dodawaj zdjęcia i notatki bezpośrednio do raportu z akcji',
  },
  {
    icon: Download,
    title: 'Export raportów',
    description: 'Generuj profesjonalne raporty PDF z pełną dokumentacją akcji',
  },
  {
    icon: Shield,
    title: 'Bezpieczeństwo danych',
    description: 'Dane przechowywane lokalnie na urządzeniu - pełna kontrola i prywatność',
  },
];

export default function FeaturesList() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Wszystko czego potrzebujesz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kompleksowe narzędzie wspierające każdy etap akcji ratowniczej
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="inline-flex p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 border-2 border-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Gotowy do rozpoczęcia?
          </p>
          <a
            href="#start"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium group"
          >
            Rozpocznij pierwszą akcję
            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

