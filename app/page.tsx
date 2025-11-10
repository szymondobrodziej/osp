'use client';

import { useState, useEffect } from 'react';
import { useIncidentStore } from '@/store/incident-store';
import { useChecklistStore } from '@/store/checklist-store';
import IncidentTypeSelector from '@/components/incident-type-selector';
import IncidentHeader from '@/components/incident-header';
import ChecklistView from '@/components/checklist-view';
import dynamic from 'next/dynamic';
import { IncidentType } from '@/types/incident';
import { Flame, FileText, Users, Package, StickyNote, Camera, X, Sparkles, FolderOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

// Dynamiczny import mapy (wyłącza SSR dla Leaflet)
const HydrantMap = dynamic(() => import('@/components/hydrant-map'), {
  ssr: false,
  loading: () => <div className="h-[200px] md:h-[300px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function Home() {
  const { currentIncident, createIncident, clearCurrentIncident } = useIncidentStore();
  const getTemplatesByType = useChecklistStore(state => state.getTemplatesByType);

  const [activeTab, setActiveTab] = useState<'checklist' | 'casualties' | 'resources' | 'notes' | 'photos'>('checklist');

  const handleCreateIncident = (type: IncidentType) => {
    // Natychmiastowe rozpoczęcie zdarzenia - bez formularza!
    const templates = getTemplatesByType(type);
    const defaultTemplate = templates.find(t => t.isBuiltIn && t.incidentType === type);

    createIncident(
      type,
      `Zdarzenie ${new Date().toLocaleTimeString('pl-PL')}`, // Domyślny tytuł z czasem
      'Do uzupełnienia', // Lokalizacja do uzupełnienia później
      'Do uzupełnienia', // Dowódca do uzupełnienia później
      defaultTemplate?.id
    );
  };

  const handleEndIncident = () => {
    if (confirm('Czy na pewno chcesz zakończyć to zdarzenie?')) {
      clearCurrentIncident();
    }
  };

  // Ekran startowy - wybór typu zdarzenia
  if (!currentIncident) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 animate-gradient" />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/10" />

        {/* Floating shapes for depth */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float-delayed" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-3 md:p-4">
          <div className="max-w-6xl w-full mx-auto space-y-4 md:space-y-8">

            {/* Hero Section */}
            <div className="text-center space-y-3 md:space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-200 animate-pulse" />
                <span className="text-white font-medium text-sm md:text-base">Profesjonalny system dla OSP</span>
              </div>

              <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
                <div className="relative">
                  <Flame className="w-12 h-12 md:w-20 md:h-20 text-white drop-shadow-2xl animate-pulse" />
                  <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                </div>
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
                  OSP Commander
                </h1>
              </div>

              <p className="text-base md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto px-4">
                Nowoczesne wsparcie dla Kierujących Działaniem Ratowniczym
              </p>
            </div>

            {/* Main Card */}
            <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl animate-slide-up">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      Rozpocznij nową akcję
                    </CardTitle>
                    <CardDescription className="text-base">
                      Wybierz typ zdarzenia aby rozpocząć procedurę ratowniczą
                    </CardDescription>
                  </div>
                  <Link href="/checklists">
                    <Button variant="outline" className="gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Biblioteka checklistów
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <IncidentTypeSelector onSelect={handleCreateIncident} />
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center space-y-2 animate-fade-in-delayed">
              <p className="text-white/80 text-sm font-medium">
                © 2025 OSP Commander
              </p>
              <p className="text-white/60 text-xs">
                Zbudowane z ❤️ dla polskich strażaków
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Główny widok akcji
  if (currentIncident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Modern Header with Glassmorphism */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-red-600 to-orange-600 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative">
                  <Flame className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white/30 blur-lg rounded-full" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-white">OSP Commander</h1>
                  <p className="text-xs text-white/80 hidden md:block">Akcja w toku</p>
                </div>
              </div>
              <Button
                onClick={handleEndIncident}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm h-8 md:h-10 text-xs md:text-sm px-2 md:px-4"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Zakończ akcję</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-3 md:space-y-4">
          {/* Incident Header Card */}
          <div className="animate-slide-up">
            <IncidentHeader incident={currentIncident} />
          </div>

          {/* Modern Tabs */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl animate-slide-up-delayed">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="w-full justify-start h-auto p-0.5 md:p-1 bg-gray-100/50 rounded-t-lg overflow-x-auto flex-nowrap">
                <TabsTrigger value="checklist" className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Lista</span>
                </TabsTrigger>
                <TabsTrigger value="casualties" className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Poszkodowani</span>
                  <Badge variant="secondary" className="ml-0.5 md:ml-1 text-xs">{currentIncident.casualties.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Siły</span>
                  <Badge variant="secondary" className="ml-0.5 md:ml-1 text-xs">{currentIncident.resources.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  <StickyNote className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Notatki</span>
                  <Badge variant="secondary" className="ml-0.5 md:ml-1 text-xs">{currentIncident.notes.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Zdjęcia</span>
                  <Badge variant="secondary" className="ml-0.5 md:ml-1 text-xs">{currentIncident.photos.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="checklist" className="mt-0 p-3 md:p-6 space-y-4">
                {/* Mapa z hydrantami */}
                {currentIncident.location.coordinates && (
                  <HydrantMap
                    incidentLocation={{
                      lat: currentIncident.location.coordinates.lat,
                      lng: currentIncident.location.coordinates.lng,
                      address: currentIncident.location.address
                    }}
                    onHydrantSelect={(hydrant) => {
                      console.log('Wybrano hydrant:', hydrant);
                      // Tutaj możesz dodać logikę np. dodania notatki o wybranym hydrancie
                    }}
                  />
                )}

                {/* Checklista */}
                <ChecklistView categories={currentIncident.checklists} />
              </TabsContent>

              <TabsContent value="casualties" className="mt-0 p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Moduł poszkodowanych</h3>
                  <p className="text-gray-500">Funkcjonalność w przygotowaniu</p>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0 p-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Moduł sił i środków</h3>
                  <p className="text-gray-500">Funkcjonalność w przygotowaniu</p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0 p-6">
                <div className="text-center py-12">
                  <StickyNote className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Moduł notatek</h3>
                  <p className="text-gray-500">Funkcjonalność w przygotowaniu</p>
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-0 p-6">
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Moduł zdjęć</h3>
                  <p className="text-gray-500">Funkcjonalność w przygotowaniu</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
