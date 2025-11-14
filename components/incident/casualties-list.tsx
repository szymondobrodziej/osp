'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, User, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalSigns {
  respiratoryRate: number | null;
  respiratoryRateNote?: string;
  pulseRate: number | null;
  pulseQuality: 'NORMAL' | 'WEAK' | 'STRONG' | 'IRREGULAR' | 'ABSENT' | null;
  oxygenSaturation: number | null;
  temperature: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  measuredAt: string;
}

interface Casualty {
  id: string;
  name: string;
  age?: string;
  ageGroup: 'ADULT' | 'CHILD' | 'INFANT' | null;
  consciousness: 'A' | 'C' | 'V' | 'P' | 'U' | null;
  vitalSigns: VitalSigns[];
  injuries: string; // Free text for now
  actionsTaken: string; // Free text for now
  sampleNotes: string; // SAMPLE interview notes
  additionalNotes: string;
  timestamp: string;
}

const createEmptyCasualty = (): Omit<Casualty, 'id' | 'timestamp'> => ({
  name: '',
  age: '',
  ageGroup: null,
  consciousness: null,
  vitalSigns: [],
  injuries: '',
  actionsTaken: '',
  sampleNotes: '',
  additionalNotes: '',
});

const createEmptyVitalSigns = (): VitalSigns => ({
  respiratoryRate: null,
  respiratoryRateNote: '',
  pulseRate: null,
  pulseQuality: null,
  oxygenSaturation: null,
  temperature: null,
  bloodPressureSystolic: null,
  bloodPressureDiastolic: null,
  measuredAt: new Date().toISOString(),
});

export default function CasualtiesList() {
  const [casualties, setCasualties] = useState<Casualty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('incident-casualties');
    if (stored) {
      try {
        setCasualties(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load casualties:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('incident-casualties', JSON.stringify(casualties));
    }
  }, [casualties, isLoaded]);

  const handleAdd = () => {
    const newCasualty: Casualty = {
      id: Date.now().toString(),
      ...createEmptyCasualty(),
      timestamp: new Date().toISOString(),
    };
    setCasualties([newCasualty, ...casualties]);
    setExpandedId(newCasualty.id);
  };

  const handleUpdate = (id: string, updates: Partial<Casualty>) => {
    setCasualties(casualties.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const handleAddVitalSigns = (id: string, vitalSigns: VitalSigns) => {
    setCasualties(casualties.map(c =>
      c.id === id
        ? { ...c, vitalSigns: [...c.vitalSigns, vitalSigns] }
        : c
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno usunąć poszkodowanego?')) {
      setCasualties(casualties.filter(c => c.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const validateRespiratoryRate = (rate: number | null, ageGroup: string | null) => {
    if (rate === null || ageGroup === null) return null;
    if (rate === 0) return { status: 'CRITICAL', alert: '🔴 BRAK ODDECHU - ROZPOCZNIJ NATYCHMIAST REANIMACJĘ!' };
    if (ageGroup === 'ADULT') {
      if (rate < 10) return { status: 'CRITICAL', alert: '🔴 Oddech zbyt wolny - Ryzyko zatrzymania oddechu!' };
      if (rate < 12 || rate > 20) return { status: 'ABNORMAL', alert: '⚠️ Oddech poza normą (12-20/min)' };
    }
    return { status: 'NORMAL', alert: '✅ Oddech w normie' };
  };

  const validatePulseRate = (rate: number | null, ageGroup: string | null) => {
    if (rate === null || ageGroup === null) return null;
    if (rate === 0) return { status: 'CRITICAL', alert: '🔴 BRAK TĘTNA - ROZPOCZNIJ NATYCHMIAST REANIMACJĘ!' };
    if (ageGroup === 'ADULT') {
      if (rate < 50) return { status: 'ABNORMAL', alert: '⚠️ Bradykardia (tętno < 50/min)' };
      if (rate > 120) return { status: 'ABNORMAL', alert: '⚠️ Tachykardia (tętno > 120/min)' };
    }
    return { status: 'NORMAL', alert: '✅ Tętno w normie' };
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Poszkodowani</h3>
          <p className="text-sm text-gray-500">
            {casualties.length} {casualties.length === 1 ? 'osoba' : 'osób'}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto h-12 sm:h-10"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="ml-2 sm:ml-0">Dodaj poszkodowanego</span>
        </Button>
      </div>

      {/* Lista poszkodowanych */}
      <div className="space-y-2">
        {casualties.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Brak poszkodowanych</p>
            <p className="text-xs text-gray-400 mt-1">Kliknij "Dodaj poszkodowanego" aby dodać</p>
          </Card>
        ) : (
          casualties.map((casualty) => (
            <Card key={casualty.id} className="p-4 border-l-4 border-l-red-600">
              {/* Header z imieniem i przyciskiem usuń */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-red-600" />
                  <Input
                    value={casualty.name}
                    onChange={(e) => handleUpdate(casualty.id, { name: e.target.value })}
                    placeholder="Imię i nazwisko"
                    className="font-semibold text-base h-9"
                  />
                </div>
                <Button
                  onClick={() => handleDelete(casualty.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Podstawowe dane */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-gray-600">Wiek</Label>
                  <Input
                    value={casualty.age || ''}
                    onChange={(e) => handleUpdate(casualty.id, { age: e.target.value })}
                    placeholder="np. 45"
                    className="h-9 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Grupa wiekowa</Label>
                  <select
                    value={casualty.ageGroup || ''}
                    onChange={(e) => handleUpdate(casualty.id, { ageGroup: e.target.value as any })}
                    className="w-full h-9 mt-1 px-3 border rounded-md text-sm"
                  >
                    <option value="">Wybierz...</option>
                    <option value="ADULT">Dorosły</option>
                    <option value="CHILD">Dziecko</option>
                    <option value="INFANT">Niemowlę</option>
                  </select>
                </div>
              </div>

              {/* Świadomość ACVPU */}
              <div className="mb-3">
                <Label className="text-xs text-gray-600">Świadomość (ACVPU)</Label>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {(['A', 'C', 'V', 'P', 'U'] as const).map((level) => (
                    <Button
                      key={level}
                      onClick={() => handleUpdate(casualty.id, { consciousness: level })}
                      variant={casualty.consciousness === level ? 'default' : 'outline'}
                      className={cn(
                        'h-9 text-xs',
                        casualty.consciousness === level && (level === 'U' ? 'bg-red-600' : level === 'P' || level === 'V' ? 'bg-orange-500' : 'bg-green-600')
                      )}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A=Przytomny, C=Zdezorientowany, V=Głos, P=Ból, U=Nie reaguje
                </p>
              </div>

              {/* Przycisk rozwiń/zwiń */}
              <Button
                onClick={() => setExpandedId(expandedId === casualty.id ? null : casualty.id)}
                variant="outline"
                className="w-full mb-3"
                size="sm"
              >
                {expandedId === casualty.id ? '▲ Zwiń szczegóły' : '▼ Rozwiń szczegóły (parametry, urazy, działania)'}
              </Button>

              {/* Rozwinięte szczegóły */}
              {expandedId === casualty.id && (
                <div className="space-y-4 pt-3 border-t">
                  {/* Parametry życiowe */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      📊 Parametry życiowe
                    </Label>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-600">Oddech (oddechy/min)</Label>
                          <Input
                            type="number"
                            placeholder="np. 16"
                            className="h-9 mt-1"
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                const newVitalSigns = createEmptyVitalSigns();
                                newVitalSigns.respiratoryRate = value;
                                handleAddVitalSigns(casualty.id, newVitalSigns);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Tętno (uderzeń/min)</Label>
                          <Input
                            type="number"
                            placeholder="np. 80"
                            className="h-9 mt-1"
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                const newVitalSigns = createEmptyVitalSigns();
                                newVitalSigns.pulseRate = value;
                                handleAddVitalSigns(casualty.id, newVitalSigns);
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Historia pomiarów */}
                      {casualty.vitalSigns.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <Label className="text-xs text-gray-600 mb-2 block">Historia pomiarów:</Label>
                          <div className="space-y-1">
                            {casualty.vitalSigns.map((vs, idx) => {
                              const respAlert = validateRespiratoryRate(vs.respiratoryRate, casualty.ageGroup);
                              const pulseAlert = validatePulseRate(vs.pulseRate, casualty.ageGroup);
                              return (
                                <div key={idx} className="text-xs bg-white p-2 rounded border">
                                  <div className="font-semibold text-gray-600">
                                    {new Date(vs.measuredAt).toLocaleTimeString('pl-PL')}
                                  </div>
                                  {vs.respiratoryRate !== null && (
                                    <div className={cn(
                                      'mt-1',
                                      respAlert?.status === 'CRITICAL' && 'text-red-700 font-semibold',
                                      respAlert?.status === 'ABNORMAL' && 'text-orange-600'
                                    )}>
                                      Oddech: {vs.respiratoryRate}/min {respAlert?.alert}
                                    </div>
                                  )}
                                  {vs.pulseRate !== null && (
                                    <div className={cn(
                                      'mt-1',
                                      pulseAlert?.status === 'CRITICAL' && 'text-red-700 font-semibold',
                                      pulseAlert?.status === 'ABNORMAL' && 'text-orange-600'
                                    )}>
                                      Tętno: {vs.pulseRate}/min {pulseAlert?.alert}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Urazy */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      🩹 Urazy i obrażenia
                    </Label>
                    <Textarea
                      value={casualty.injuries}
                      onChange={(e) => handleUpdate(casualty.id, { injuries: e.target.value })}
                      placeholder="np. Złamanie prawej goleni, rana cięta lewego ramienia..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  {/* Działania podjęte */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      🚑 Działania podjęte
                    </Label>
                    <Textarea
                      value={casualty.actionsTaken}
                      onChange={(e) => handleUpdate(casualty.id, { actionsTaken: e.target.value })}
                      placeholder="np. Unieruchomienie prawej nogi szynami Kramera, pozycja boczna ustalona..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  {/* Wywiad SAMPLE */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      📋 Wywiad SAMPLE
                    </Label>
                    <Textarea
                      value={casualty.sampleNotes}
                      onChange={(e) => handleUpdate(casualty.id, { sampleNotes: e.target.value })}
                      placeholder="Objawy, Alergie, Leki, Przeszłość medyczna, Ostatni posiłek, Zdarzenie..."
                      rows={4}
                      className="text-sm"
                    />
                  </div>

                  {/* Dodatkowe notatki */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      📝 Dodatkowe notatki
                    </Label>
                    <Textarea
                      value={casualty.additionalNotes}
                      onChange={(e) => handleUpdate(casualty.id, { additionalNotes: e.target.value })}
                      placeholder="Inne istotne informacje..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

