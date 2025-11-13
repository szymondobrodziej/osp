'use client';

import { useState, useRef } from 'react';
import { VehicleConfiguration, EQUIPMENT_CATEGORY_LABELS } from '@/types/vehicle-equipment';
import { useVehicleEquipmentStore } from '@/store/vehicle-equipment-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';

interface VehicleEquipmentPlanViewProps {
  vehicle: VehicleConfiguration;
}

export function VehicleEquipmentPlanView({ vehicle }: VehicleEquipmentPlanViewProps) {
  const { updateCompartment } = useVehicleEquipmentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [draggingCompartment, setDraggingCompartment] = useState<string | null>(null);

  const handleMouseDown = (compartmentId: string, e: React.MouseEvent) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingCompartment(compartmentId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingCompartment || !containerRef.current || !editMode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    updateCompartment(vehicle.id, draggingCompartment, {
      position: { x: clampedX, y: clampedY },
    });
  };

  const handleMouseUp = () => {
    setDraggingCompartment(null);
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <h2 className="text-base md:text-xl font-bold">{vehicle.name}</h2>
              <Badge variant="secondary" className="text-xs">
                {vehicle.compartments.reduce((sum, c) => sum + c.items.length, 0)} elementów
              </Badge>
              {editMode && (
                <Badge variant="default" className="animate-pulse text-xs">
                  <span className="hidden md:inline">Tryb edycji - przeciągaj schowki</span>
                  <span className="md:hidden">Edycja</span>
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <Button
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? <Unlock className="h-3 w-3 md:h-4 md:w-4 md:mr-2" /> : <Lock className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />}
                <span className="hidden md:inline">{editMode ? 'Zablokuj' : 'Edytuj pozycje'}</span>
                <span className="md:hidden">{editMode ? 'Zablokuj' : 'Edytuj'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="hidden sm:flex"
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                {showGrid ? 'Ukryj' : 'Pokaż'} siatkę
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
              >
                {showCategories ? <EyeOff className="h-3 w-3 md:h-4 md:w-4 md:mr-2" /> : <Eye className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />}
                <span className="hidden md:inline">Kategorie</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <span className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 md:py-2 bg-muted rounded-md min-w-[50px] md:min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(1)}
                className="hidden sm:flex"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan pojazdu - DUŻY CANVAS Z SCROLLOWANIEM */}
      <div className="bg-slate-50 rounded-lg overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="p-4 md:p-8">
          <div
            ref={containerRef}
            className={`relative bg-white rounded-lg shadow-lg ${editMode ? 'cursor-crosshair' : ''}`}
            style={{
              width: `${2400 * zoom}px`,
              height: `${1600 * zoom}px`,
              minWidth: '100%',
              minHeight: '1600px',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
          {/* Siatka */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Linie pionowe */}
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-blue-200/50"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
              {/* Linie poziome */}
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-blue-200/50"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
            </div>
          )}

          {/* Schowki z wyposażeniem */}
          {vehicle.compartments.map((compartment) => {
            // Grupuj wyposażenie według kategorii
            const itemsByCategory = compartment.items.reduce((acc, item) => {
              if (!acc[item.category]) {
                acc[item.category] = [];
              }
              acc[item.category].push(item);
              return acc;
            }, {} as Record<string, typeof compartment.items>);

            const totalItems = compartment.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={compartment.id}
                className={`absolute rounded-lg shadow-md overflow-visible ${
                  editMode ? 'cursor-move hover:ring-4 hover:ring-blue-500' : ''
                } ${draggingCompartment === compartment.id ? 'opacity-70 ring-4 ring-blue-500 z-50' : 'z-10'}`}
                style={{
                  left: `${compartment.position.x}%`,
                  top: `${compartment.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={(e) => handleMouseDown(compartment.id, e)}
              >
                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    width: `${compartment.size.width * 12 * zoom}px`,
                    minWidth: '250px',
                    backgroundColor: compartment.color || '#94a3b8',
                    border: '3px solid rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Nagłówek schowka */}
                  <div
                    className="px-3 py-2 border-b-2 border-black/20"
                    style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm drop-shadow-md">
                        {compartment.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-xs font-bold"
                      >
                        {totalItems} szt.
                      </Badge>
                    </div>
                  </div>

                  {/* Lista wyposażenia - ROZWINIĘTA (bez scrollowania) */}
                  <div className="p-2">
                    {showCategories ? (
                      // Widok z kategoriami
                      <div className="space-y-2">
                        {Object.entries(itemsByCategory).map(([category, items]) => (
                          <div key={category} className="space-y-1">
                            <div className="text-[10px] font-bold text-white/80 uppercase tracking-wide px-1">
                              {EQUIPMENT_CATEGORY_LABELS[category as keyof typeof EQUIPMENT_CATEGORY_LABELS]}
                            </div>
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white/95 rounded px-2 py-1.5 text-xs shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-slate-800 flex-1 leading-tight">
                                    {item.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] font-bold shrink-0"
                                  >
                                    {item.quantity} {item.unit || 'szt'}
                                  </Badge>
                                </div>
                                {item.description && (
                                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                                    {item.description}
                                  </div>
                                )}
                                {item.expiryDate && (
                                  <div className="mt-1">
                                    <Badge
                                      variant={new Date(item.expiryDate) < new Date() ? "destructive" : "default"}
                                      className="text-[9px] px-1 py-0"
                                    >
                                      📅 {new Date(item.expiryDate).toLocaleDateString('pl-PL')}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Widok bez kategorii (kompaktowy)
                      <div className="space-y-1">
                        {compartment.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white/95 rounded px-2 py-1.5 text-xs shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-slate-800 flex-1 leading-tight">
                                {item.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold shrink-0"
                              >
                                {item.quantity} {item.unit || 'szt'}
                              </Badge>
                            </div>
                            {item.description && (
                              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                                {item.description}
                              </div>
                            )}
                            {item.expiryDate && (
                              <div className="mt-1">
                                <Badge
                                  variant={new Date(item.expiryDate) < new Date() ? "destructive" : "default"}
                                  className="text-[9px] px-1 py-0"
                                >
                                  📅 {new Date(item.expiryDate).toLocaleDateString('pl-PL')}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

            {/* Legenda pojazdu */}
            <div className="absolute top-8 left-8 bg-white/95 rounded-lg shadow-lg p-6 max-w-sm">
              <h3 className="font-bold text-2xl mb-3">{vehicle.name}</h3>
              {vehicle.specifications && (
                <div className="space-y-2 text-base text-slate-600">
                  {vehicle.specifications.waterTank && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-blue-500">💧</span>
                      <span>Zbiornik: {vehicle.specifications.waterTank}L</span>
                    </div>
                  )}
                  {vehicle.specifications.foamTank && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-orange-500">🧴</span>
                      <span>Piana: {vehicle.specifications.foamTank}L</span>
                    </div>
                  )}
                  {vehicle.specifications.pump && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-red-500">⚙️</span>
                      <span>Pompa: {vehicle.specifications.pump}</span>
                    </div>
                  )}
                  {vehicle.specifications.crew && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-green-500">👥</span>
                      <span>Załoga: {vehicle.specifications.crew} osób</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Statystyki */}
            <div className="absolute bottom-8 right-8 bg-white/95 rounded-lg shadow-lg p-6">
              <h4 className="font-bold text-lg mb-3">Podsumowanie</h4>
              <div className="space-y-2 text-base">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-600">Schowki:</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">{vehicle.compartments.length}</Badge>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-600">Elementy:</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {vehicle.compartments.reduce((sum, c) => sum + c.items.length, 0)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-600">Łącznie:</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {vehicle.compartments.reduce(
                      (sum, c) => sum + c.items.reduce((s, i) => s + i.quantity, 0),
                      0
                    )} szt.
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instrukcje */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>Schowki przednie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>Schowki tylne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span>Kabina</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span>Pompa</span>
            </div>
            <div className="flex-1" />
            <span className="text-xs">
              💡 Kliknij <strong>"Edytuj pozycje"</strong> aby przeciągać schowki | Wszystkie elementy rozwinięte - brak scrollowania
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

