'use client';

import { useEffect, useState } from 'react';
import { useVehicleEquipmentStore } from '@/store/vehicle-equipment-store';
import { VehicleEquipmentPlanView } from '@/components/vehicle-equipment-plan-view';
import { VehicleEquipmentEditor } from '@/components/vehicle-equipment-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Plus,
  Settings,
  Map,
  AlertCircle,
} from 'lucide-react';
import { EQUIPMENT_CATEGORY_LABELS } from '@/types/vehicle-equipment';

export default function VehicleEquipmentPage() {
  const [mounted, setMounted] = useState(false);
  const { 
    vehicles, 
    currentVehicleId, 
    loadDefaultVehicles, 
    setCurrentVehicle,
    getCurrentVehicle,
    getEquipmentStats,
  } = useVehicleEquipmentStore();

  useEffect(() => {
    setMounted(true);
    loadDefaultVehicles();
  }, [loadDefaultVehicles]);

  if (!mounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ładowanie wyposażenia pojazdu...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentVehicle = getCurrentVehicle();
  const stats = currentVehicle ? getEquipmentStats(currentVehicle.id) : null;

  if (vehicles.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
              Brak pojazdów
            </CardTitle>
            <CardDescription>
              Nie znaleziono żadnych pojazdów w systemie. Dodaj pierwszy pojazd, aby rozpocząć.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj pojazd
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Nagłówek strony */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2 md:gap-3">
            <Truck className="h-6 w-6 md:h-10 md:w-10 text-primary" />
            Wyposażenie pojazdu
          </h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Przeglądaj i zarządzaj wyposażeniem pojazdów ratowniczych
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="md:size-default">
            <Settings className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Ustawienia</span>
          </Button>
          <Button size="sm" className="md:size-default">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Dodaj pojazd</span>
          </Button>
        </div>
      </div>

      {/* Wybór pojazdu */}
      {vehicles.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wybierz pojazd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {vehicles.map((vehicle) => (
                <Button
                  key={vehicle.id}
                  variant={currentVehicleId === vehicle.id ? 'default' : 'outline'}
                  onClick={() => setCurrentVehicle(vehicle.id)}
                >
                  {vehicle.name}
                  {vehicle.registrationNumber && (
                    <span className="ml-2 font-mono text-xs opacity-70">
                      {vehicle.registrationNumber}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elementy wygasające w ciągu 30 dni */}
      {currentVehicle && (() => {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringItems = currentVehicle.compartments.flatMap(compartment =>
          compartment.items
            .filter(item => {
              if (!item.expiryDate) return false;
              const expiryDate = new Date(item.expiryDate);
              return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
            })
            .map(item => ({
              ...item,
              compartmentName: compartment.name,
              daysUntilExpiry: Math.ceil((new Date(item.expiryDate!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            }))
        ).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

        if (expiringItems.length > 0) {
          return (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex flex-wrap items-center gap-2">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                  <span className="flex-1">Elementy wygasające w ciągu 30 dni</span>
                  <Badge variant="destructive" className="text-xs">
                    {expiringItems.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Sprawdź i wymień elementy, których termin ważności wkrótce upływa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm md:text-base truncate">{item.name}</div>
                        <div className="text-xs md:text-sm text-slate-600 mt-0.5 truncate">
                          {item.compartmentName} • {EQUIPMENT_CATEGORY_LABELS[item.category]}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
                        <Badge variant="outline" className="text-xs">
                          {item.quantity} {item.unit || 'szt'}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs md:text-sm font-semibold text-orange-600">
                            {item.daysUntilExpiry} {item.daysUntilExpiry === 1 ? 'dzień' : 'dni'}
                          </div>
                          <div className="text-xs text-slate-500">
                            📅 {new Date(item.expiryDate!).toLocaleDateString('pl-PL')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}

      {/* Główna zawartość */}
      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plan" className="text-xs md:text-sm">
            <Map className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden sm:inline">Plan wyposażenia</span>
            <span className="sm:hidden">Plan</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs md:text-sm">
            <Settings className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden sm:inline">Zarządzanie</span>
            <span className="sm:hidden">Zarządz.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-4 md:mt-6">
          {currentVehicle ? (
            <VehicleEquipmentPlanView vehicle={currentVehicle} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Wybierz pojazd, aby zobaczyć plan wyposażenia</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-6 hidden">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Statystyki wyposażenia</CardTitle>
                <CardDescription>
                  Szczegółowy podział wyposażenia według kategorii
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.itemsByCategory)
                    .filter(([_, count]) => count > 0)
                    .sort(([_, a], [__, b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            {EQUIPMENT_CATEGORY_LABELS[category as keyof typeof EQUIPMENT_CATEGORY_LABELS]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-48 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{
                                width: `${(count / stats.totalItems) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="font-semibold w-12 text-right">{count}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          {currentVehicle ? (
            <VehicleEquipmentEditor vehicle={currentVehicle} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Wybierz pojazd aby edytować wyposażenie</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

