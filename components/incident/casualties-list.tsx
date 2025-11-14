'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, User, AlertCircle, Trash2, Edit2, Check, X, Stethoscope, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VictimAssessmentComponent } from '@/components/actions/victim-assessment';

interface Casualty {
  id: string;
  name: string;
  age?: string;
  condition: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  timestamp: string; // Changed to string for localStorage
}

export default function CasualtiesList() {
  const [casualties, setCasualties] = useState<Casualty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assessingId, setAssessingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    condition: 'moderate' as Casualty['condition'],
    description: '',
  });

  const handleAdd = () => {
    if (!formData.name.trim()) return;

    const newCasualty: Casualty = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age,
      condition: formData.condition,
      description: formData.description,
      timestamp: new Date().toISOString(),
    };

    setCasualties([newCasualty, ...casualties]);
    setFormData({ name: '', age: '', condition: 'moderate', description: '' });
    setIsAdding(false);
  };

  const handleEdit = (casualty: Casualty) => {
    setEditingId(casualty.id);
    setFormData({
      name: casualty.name,
      age: casualty.age || '',
      condition: casualty.condition,
      description: casualty.description,
    });
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name.trim()) return;

    setCasualties(casualties.map(c => 
      c.id === editingId 
        ? { ...c, ...formData, age: formData.age || undefined }
        : c
    ));
    setEditingId(null);
    setFormData({ name: '', age: '', condition: 'moderate', description: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno usunąć poszkodowanego?')) {
      setCasualties(casualties.filter(c => c.id !== id));
    }
  };

  const getConditionColor = (condition: Casualty['condition']) => {
    switch (condition) {
      case 'critical': return 'bg-red-600';
      case 'serious': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'minor': return 'bg-green-500';
    }
  };

  const getConditionLabel = (condition: Casualty['condition']) => {
    switch (condition) {
      case 'critical': return '🚨 Krytyczny';
      case 'serious': return '⚠️ Poważny';
      case 'moderate': return '⚡ Umiarkowany';
      case 'minor': return '✓ Lekki';
    }
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
          onClick={() => setIsAdding(true)}
          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto h-12 sm:h-10"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="ml-2 sm:ml-0">Dodaj poszkodowanego</span>
        </Button>
      </div>

      {/* Instrukcja medyczna dla strażaka */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-red-900 text-base">
              🚑 INSTRUKCJA OCENY POSZKODOWANEGO - PIERWSZA POMOC
            </h4>
            <div className="text-sm text-red-900 space-y-2">
              {/* ACVPU */}
              <div>
                <p className="font-semibold">1️⃣ OCENA ŚWIADOMOŚCI (ACVPU):</p>
                <ul className="list-disc list-inside pl-2 space-y-0.5 text-xs">
                  <li>
                    <strong>A (Przytomny)</strong> - Przytomny, reaguje, zorientowany →
                    Badanie urazowe
                  </li>
                  <li>
                    <strong>C (Zdezorientowany)</strong> - Zdezorientowany, senny → Badanie
                    urazowe
                  </li>
                  <li>
                    <strong>V (Głos)</strong> - Reaguje tylko na głos → Badanie ABC
                  </li>
                  <li>
                    <strong>P (Ból)</strong> - Reaguje tylko na ból → Badanie ABC
                  </li>
                  <li>
                    <strong className="text-red-700">U (Nie reaguje)</strong> - Nie reaguje
                    → <strong>ABC + PODEJRZEWAJ NZK!</strong>
                  </li>
                </ul>
              </div>

              {/* ABC */}
              <div>
                <p className="font-semibold">2️⃣ BADANIE ABC (jeśli V/P/U):</p>
                <ul className="list-disc list-inside pl-2 space-y-0.5 text-xs">
                  <li>
                    <strong>A (Drogi oddechowe)</strong> - Usuń ciała obce, udrożnij drogi
                    oddechowe (czoło-żuchwa lub uniesienie żuchwy przy urazie kręgosłupa)
                  </li>
                  <li>
                    <strong>B (Oddychanie)</strong> - Policz oddechy/min:{' '}
                    <span className="text-green-700">10-20 OK</span>,{' '}
                    <span className="text-red-700">&lt;10 lub &gt;20 UWAGA</span>,{' '}
                    <strong className="text-red-700">0 = RKO!</strong>
                  </li>
                  <li>
                    <strong>C (Krążenie)</strong> - Sprawdź tętno, krwawienie:{' '}
                    <strong className="text-red-700">
                      Tętnicze = TAMUJ KRWOTOK!
                    </strong>
                    , Brak tętna = <strong className="text-red-700">RKO!</strong>
                  </li>
                </ul>
              </div>

              {/* Badanie urazowe */}
              <div>
                <p className="font-semibold">
                  3️⃣ BADANIE URAZOWE (Od głowy do stóp):
                </p>
                <p className="text-xs pl-2">
                  Sprawdź: Głowa/Szyja → Klatka → Brzuch → Miednica → Kończyny → Plecy
                  (DEFORMACJE, OTARCIA, RANY, TKLIWOŚĆ, OBRZĘKI)
                </p>
              </div>

              {/* SAMPLE */}
              <div>
                <p className="font-semibold">4️⃣ SAMPLE (Wywiad):</p>
                <p className="text-xs pl-2">
                  <strong>O</strong>bjawy, <strong>A</strong>lergie,{' '}
                  <strong>L</strong>eki, <strong>P</strong>rzeszłość medyczna,{' '}
                  <strong>O</strong>statni posiłek, <strong>Z</strong>darzenie
                </p>
              </div>

              {/* Alerty */}
              <div className="pt-2 border-t border-red-300">
                <p className="font-bold text-red-700">
                  ⚠️ NATYCHMIASTOWE DZIAŁANIE:
                </p>
                <ul className="list-disc list-inside pl-2 space-y-0.5 text-xs">
                  <li>Brak oddechu (0/min) → <strong>RKO!</strong></li>
                  <li>Brak tętna → <strong>RKO!</strong></li>
                  <li>Krwawienie tętnicze → <strong>TAMUJ KRWOTOK!</strong></li>
                  <li>Drogi niedrożne → <strong>UDROŻNIJ!</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="p-4 border-2 border-blue-500">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Imię i nazwisko *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jan Kowalski"
                  className="h-12 sm:h-9"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Wiek
                </label>
                <Input
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="np. 45"
                  className="h-12 sm:h-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Stan
              </label>
              <div className="grid grid-cols-2 sm:flex gap-2">
                {(['critical', 'serious', 'moderate', 'minor'] as const).map((cond) => (
                  <Button
                    key={cond}
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    variant={formData.condition === cond ? 'default' : 'outline'}
                    className={cn(
                      'flex-1 h-12 sm:h-9 text-xs sm:text-xs',
                      formData.condition === cond && getConditionColor(cond)
                    )}
                  >
                    {getConditionLabel(cond)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Opis / Obrażenia
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Opis stanu, obrażeń, podjętych działań..."
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 h-12 sm:h-10"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingId ? 'Zapisz' : 'Dodaj'}
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: '', age: '', condition: 'moderate', description: '' });
                }}
                variant="outline"
                className="flex-1 sm:flex-none h-12 sm:h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* List */}
      <div className="space-y-2">
        {casualties.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Brak poszkodowanych</p>
            <p className="text-xs text-gray-400 mt-1">Kliknij "Dodaj poszkodowanego" aby dodać</p>
          </Card>
        ) : (
          casualties.map((casualty) => (
            <Card
              key={casualty.id}
              className={cn(
                'p-3 border-l-4 transition-all',
                editingId === casualty.id && 'ring-2 ring-blue-500'
              )}
              style={{ borderLeftColor: getConditionColor(casualty.condition).replace('bg-', '#') }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm">{casualty.name}</h4>
                    {casualty.age && (
                      <span className="text-xs text-gray-500">({casualty.age} lat)</span>
                    )}
                    <Badge className={cn('text-xs', getConditionColor(casualty.condition))}>
                      {getConditionLabel(casualty.condition)}
                    </Badge>
                  </div>
                  {casualty.description && (
                    <p className="text-xs text-gray-600 mt-1">{casualty.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(casualty.timestamp).toLocaleTimeString('pl-PL')}
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    onClick={() => setAssessingId(casualty.id)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    title="Ocena pierwszej pomocy"
                  >
                    <Stethoscope className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleEdit(casualty)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(casualty.id)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog oceny pierwszej pomocy */}
      <Dialog open={!!assessingId} onOpenChange={(open) => !open && setAssessingId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Ocena Pierwszej Pomocy -{' '}
              {casualties.find((c) => c.id === assessingId)?.name}
            </DialogTitle>
          </DialogHeader>
          {assessingId && (
            <VictimAssessmentComponent
              actionId={assessingId}
              onSave={(assessment) => {
                console.log('Zapisano ocenę:', assessment);
                setAssessingId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

