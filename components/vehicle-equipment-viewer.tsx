'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VehicleConfiguration, VehicleCompartment, EquipmentItem, EQUIPMENT_CATEGORY_LABELS } from '@/types/vehicle-equipment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Droplet, 
  Gauge, 
  Users, 
  Package, 
  Search,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface VehicleEquipmentViewerProps {
  vehicle: VehicleConfiguration;
  onEditMode?: () => void;
  editable?: boolean;
}

export function VehicleEquipmentViewer({ vehicle, onEditMode, editable = false }: VehicleEquipmentViewerProps) {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [selectedCompartment, setSelectedCompartment] = useState<VehicleCompartment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentView = vehicle.views[currentViewIndex];

  const nextView = () => {
    setCurrentViewIndex((prev) => (prev + 1) % vehicle.views.length);
  };

  const prevView = () => {
    setCurrentViewIndex((prev) => (prev - 1 + vehicle.views.length) % vehicle.views.length);
  };

  const filteredCompartments = vehicle.compartments.filter(comp =>
    searchQuery === '' ||
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.items.some(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalItems = vehicle.compartments.reduce(
    (sum, comp) => sum + comp.items.reduce((s, item) => s + item.quantity, 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Nagłówek z informacjami o pojeździe */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">🚒 {vehicle.name}</CardTitle>
              <CardDescription className="mt-2">
                {vehicle.registrationNumber && (
                  <span className="font-mono text-lg">{vehicle.registrationNumber}</span>
                )}
              </CardDescription>
            </div>
            {editable && (
              <Button onClick={onEditMode} variant="outline">
                Edytuj wyposażenie
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicle.specifications?.waterTank && (
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Zbiornik wody</div>
                  <div className="font-semibold">{vehicle.specifications.waterTank}L</div>
                </div>
              </div>
            )}
            {vehicle.specifications?.pump && (
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Pompa</div>
                  <div className="font-semibold">{vehicle.specifications.pump}</div>
                </div>
              </div>
            )}
            {vehicle.specifications?.crew && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Załoga</div>
                  <div className="font-semibold">{vehicle.specifications.crew} osób</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Wyposażenie</div>
                <div className="font-semibold">{totalItems} elementów</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Główna wizualizacja */}
      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Widok pojazdu</TabsTrigger>
          <TabsTrigger value="list">Lista wyposażenia</TabsTrigger>
        </TabsList>

        {/* Widok wizualny */}
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {/* Nawigacja między widokami */}
              {vehicle.views.length > 1 && (
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevView}
                    disabled={vehicle.views.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Poprzedni
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {currentView.name} ({currentViewIndex + 1}/{vehicle.views.length})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextView}
                    disabled={vehicle.views.length <= 1}
                  >
                    Następny
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Obraz pojazdu */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden">
                <Image
                  src={currentView.imageUrl}
                  alt={currentView.name}
                  fill
                  className="object-contain"
                  priority
                />
                
                {/* Przycisk pełnego ekranu */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {currentView.description && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {currentView.description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Lista schowków pod obrazem */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicle.compartments.map((compartment) => (
              <Card
                key={compartment.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCompartment(compartment)}
                style={{
                  borderLeft: `4px solid ${compartment.color || '#94a3b8'}`,
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{compartment.name}</CardTitle>
                  {compartment.description && (
                    <CardDescription className="text-xs">
                      {compartment.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {compartment.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span className="flex-1">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="text-muted-foreground ml-1">
                              x{item.quantity}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                    {compartment.items.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {compartment.items.length - 3} więcej...
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {compartment.items.reduce((sum, item) => sum + item.quantity, 0)} elementów
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Widok listy */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Szukaj wyposażenia..."
                  className="flex-1 bg-transparent border-none outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredCompartments.map((compartment) => (
                    <div key={compartment.id} className="border-l-4 pl-4" style={{ borderColor: compartment.color }}>
                      <h3 className="font-semibold mb-2">{compartment.name}</h3>
                      <div className="space-y-2">
                        {compartment.items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between p-2 rounded hover:bg-slate-50">
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground">{item.description}</div>
                              )}
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {EQUIPMENT_CATEGORY_LABELS[item.category]}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {item.quantity} {item.unit || 'szt'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal szczegółów schowka */}
      {selectedCompartment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCompartment(null)}
        >
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{selectedCompartment.name}</CardTitle>
              {selectedCompartment.description && (
                <CardDescription>{selectedCompartment.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {selectedCompartment.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {EQUIPMENT_CATEGORY_LABELS[item.category]}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-lg">
                            {item.quantity}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.unit || 'szt'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t">
                <Button onClick={() => setSelectedCompartment(null)} className="w-full">
                  Zamknij
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

