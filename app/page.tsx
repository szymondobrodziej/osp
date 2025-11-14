'use client';

import { useState } from 'react';
import { useIncidentStore } from '@/store/incident-store';
import { useChecklistStore } from '@/store/checklist-store';
import IncidentTypeSelector from '@/components/incident-type-selector';
import IncidentHeaderV2 from '@/components/incident/incident-header-v2';
import ChecklistViewV2 from '@/components/checklist/checklist-view-v2';
import FloatingActionMenu from '@/components/incident/floating-action-menu';
import CasualtiesList from '@/components/incident/casualties-list';
import NotesList from '@/components/incident/notes-list';
import PhotosList from '@/components/incident/photos-list';
import RotationBoard from '@/components/incident/rotation-board';
import dynamic from 'next/dynamic';
import { IncidentType } from '@/types/incident';
import { Flame, FileText, Users, Package, StickyNote, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Landing page components
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import ModulesSection from '@/components/landing/modules-section';
import QuickActions from '@/components/landing/quick-actions';
import FeaturesList from '@/components/landing/features-list';
import Footer from '@/components/landing/footer';

// Dynamiczny import mapy (wyłącza SSR dla Leaflet)
const HydrantMap = dynamic(() => import('@/components/hydrant-map'), {
  ssr: false,
  loading: () => <div className="h-[200px] md:h-[300px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function Home() {
  const { currentIncident, createIncident, clearCurrentIncident } = useIncidentStore();
  const getTemplatesByType = useChecklistStore(state => state.getTemplatesByType);

  const [activeTab, setActiveTab] = useState<'checklist' | 'rotation' | 'casualties' | 'resources' | 'notes' | 'photos'>('checklist');
  const [showIncidentSelector, setShowIncidentSelector] = useState(false);
  const [isCriticalRotation, setIsCriticalRotation] = useState(false);

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
    setShowIncidentSelector(false);
  };

  const handleEndIncident = () => {
    if (confirm('Czy na pewno chcesz zakończyć to zdarzenie?')) {
      clearCurrentIncident();
    }
  };

  const handleStartAction = () => {
    setShowIncidentSelector(true);
    // Scroll to incident selector
    setTimeout(() => {
      document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Landing page - gdy nie ma aktywnego zdarzenia
  if (!currentIncident) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main>
          <HeroSection onStartAction={handleStartAction} />
          <ModulesSection />
          <QuickActions />
          <FeaturesList />

          {/* Incident Type Selector - pokazuje się po kliknięciu CTA */}
          {showIncidentSelector && (
            <section id="start" className="py-16 bg-gray-50 scroll-mt-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Wybierz typ zdarzenia
                  </h2>
                  <p className="text-gray-600">
                    Rozpocznij nową akcję ratowniczą z gotowymi checklistami
                  </p>
                </div>
                <Card className="border-2 border-red-200 shadow-xl">
                  <CardContent className="p-6">
                    <IncidentTypeSelector onSelect={handleCreateIncident} />
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // Główny widok akcji
  if (currentIncident) {
    return (
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24 transition-all duration-300",
        isCriticalRotation && "ring-8 ring-red-600 ring-inset animate-pulse"
      )}>
        {/* Incident Header V2 - Sticky */}
        <IncidentHeaderV2 incident={currentIncident} />

        {/* End Action Button - Top Right */}
        <div className="fixed top-4 right-4 z-30">
          <Button
            onClick={handleEndIncident}
            variant="outline"
            className="bg-white/90 border-red-300 text-red-600 hover:bg-red-50 backdrop-blur-sm h-10 text-sm px-4 shadow-lg"
          >
            <X className="w-4 h-4 mr-2" />
            Zakończ akcję
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-3 md:space-y-4">

          {/* Modern Tabs */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl animate-slide-up-delayed">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="w-full justify-start h-auto p-1 bg-gray-100/50 rounded-t-lg overflow-x-auto flex-nowrap">
                <TabsTrigger value="checklist" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <FileText className="w-6 h-6 md:w-4 md:h-4" />
                  <span className="font-semibold hidden md:inline">Lista</span>
                </TabsTrigger>
                <TabsTrigger value="rotation" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <Users className="w-6 h-6 md:w-4 md:h-4" />
                  <span className="font-semibold hidden md:inline">Rota</span>
                </TabsTrigger>
                <TabsTrigger value="casualties" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <Users className="w-6 h-6 md:w-4 md:h-4" />
                  <Badge variant="secondary" className="text-xs font-bold min-w-[24px] h-5 flex items-center justify-center">{currentIncident.casualties.length}</Badge>
                  <span className="font-semibold hidden md:inline">Poszkodowani</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <Package className="w-6 h-6 md:w-4 md:h-4" />
                  <Badge variant="secondary" className="text-xs font-bold min-w-[24px] h-5 flex items-center justify-center">{currentIncident.resources.length}</Badge>
                  <span className="font-semibold hidden md:inline">Siły</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <StickyNote className="w-6 h-6 md:w-4 md:h-4" />
                  <Badge variant="secondary" className="text-xs font-bold min-w-[24px] h-5 flex items-center justify-center">{currentIncident.notes.length}</Badge>
                  <span className="font-semibold hidden md:inline">Notatki</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-4 py-3 whitespace-nowrap min-h-[52px] min-w-[60px] touch-manipulation">
                  <Camera className="w-6 h-6 md:w-4 md:h-4" />
                  <Badge variant="secondary" className="text-xs font-bold min-w-[24px] h-5 flex items-center justify-center">{currentIncident.photos.length}</Badge>
                  <span className="font-semibold hidden md:inline">Zdjęcia</span>
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
                <ChecklistViewV2
                  categories={currentIncident.checklists}
                  onCriticalRotation={setIsCriticalRotation}
                />
              </TabsContent>

              <TabsContent value="rotation" className="mt-0 p-4">
                <RotationBoard />
              </TabsContent>

              <TabsContent value="casualties" className="mt-0 p-4">
                <CasualtiesList />
              </TabsContent>

              <TabsContent value="resources" className="mt-0 p-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Moduł sił i środków</h3>
                  <p className="text-gray-500">Funkcjonalność w przygotowaniu</p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0 p-4">
                <NotesList />
              </TabsContent>

              <TabsContent value="photos" className="mt-0 p-4">
                <PhotosList />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Floating Action Menu */}
        <FloatingActionMenu
          onAddCasualty={() => {
            setActiveTab('casualties');
            // TODO: Open add casualty dialog
          }}
          onAddResource={() => {
            setActiveTab('resources');
            // TODO: Open add resource dialog
          }}
          onAddNote={() => {
            setActiveTab('notes');
            // TODO: Open add note dialog
          }}
          onTakePhoto={() => {
            setActiveTab('photos');
            // TODO: Open camera
          }}
          onEmergencyCall={() => {
            // TODO: Emergency call dialog
            window.location.href = 'tel:112';
          }}
          onRequestBackup={() => {
            // TODO: Request backup dialog
            alert('Funkcja wezwania wsparcia w przygotowaniu');
          }}
          onShowMap={() => {
            setActiveTab('checklist');
            // Scroll to map
            setTimeout(() => {
              document.querySelector('.leaflet-container')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onRadioCheck={() => {
            // TODO: Radio check dialog
            alert('Funkcja sprawdzenia łączności w przygotowaniu');
          }}
        />
      </div>
    );
  }

  return null;
}
