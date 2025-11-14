'use client';

import { Flame, Github, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-red-600" />
              <span className="text-lg font-semibold text-gray-900">
                OSP Commander
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Profesjonalny system wsparcia dla Kierujących Działaniem Ratowniczym. 
              Zbudowany z myślą o polskich strażakach ochotnikach.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Moduły
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/checklists"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Checklisty
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicle-equipment"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Wyposażenie pojazdu
                </Link>
              </li>
              <li>
                <Link
                  href="#start"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Rozpocznij akcję
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Zasoby
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/szymondobrodziej/osp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Funkcje
                </Link>
              </li>
              <li>
                <a
                  href="/ROADMAP.md"
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} OSP Commander. Wszystkie prawa zastrzeżone.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Zbudowane z
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              dla polskich strażaków
            </p>
          </div>
          <div className="mt-4 text-center sm:text-left">
            <p className="text-xs text-gray-400">
              Wersja 1.0.0 • Open Source • MIT License
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

