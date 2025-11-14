'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  VictimAssessment,
  BreathingAssessment,
  BREATHING_RANGES,
  determineBreathingStatus,
} from '@/types/victim';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface BreathingStepProps {
  assessment: VictimAssessment;
  onUpdate: (breathing: BreathingAssessment) => void;
  onNext: () => void;
}

export function BreathingStep({ assessment, onUpdate, onNext }: BreathingStepProps) {
  const breathing = assessment.breathing!;
  const [inputValue, setInputValue] = useState<string>(
    breathing.respiratoryRate?.toString() || ''
  );

  const handleRateChange = (value: string) => {
    setInputValue(value);
    const rate = parseInt(value, 10);

    if (!isNaN(rate) && rate >= 0) {
      const result = determineBreathingStatus(rate);
      onUpdate({
        respiratoryRate: rate,
        status: result.status,
        alert: result.alert,
      });
    }
  };

  const canProceed = breathing.respiratoryRate !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">B – Breathing (Oddychanie)</h3>
        <p className="text-sm text-muted-foreground">
          Wprowadź liczbę oddechów na minutę (L/min).
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="respiratory-rate">Liczba Oddechów na Minutę (L/min)</Label>
            <Input
              id="respiratory-rate"
              type="number"
              min="0"
              max="60"
              value={inputValue}
              onChange={(e) => handleRateChange(e.target.value)}
              placeholder="Wprowadź liczbę oddechów..."
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Pole do wpisania liczby (np. 15, 25, 0 dla oddechu agonalnego)
            </p>
          </div>

          {/* Legenda zakresów */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Zakresy:</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>
                  <strong>10–20 L/min</strong> → ZIELONY ✅
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span>
                  <strong>&lt; 10 lub &gt; 20 L/min</strong> → POMARAŃCZOWY ⚠️ (Kontynuuj
                  kontrolę)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>
                  <strong>0 L/min lub oddech agonalny</strong> → CZERWONY! 🔴 (NATYCHMIAST
                  ROZPOCZNIJ RKO!)
                </span>
              </div>
            </div>
          </div>

          {/* Wynik oceny */}
          {breathing.respiratoryRate !== null && (
            <div
              className={`p-3 rounded-md flex items-start gap-2 ${
                breathing.status === 'CRITICAL'
                  ? 'bg-red-50 border border-red-200'
                  : breathing.status === 'ABNORMAL'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
              }`}
            >
              {breathing.status === 'CRITICAL' && (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              {breathing.status === 'ABNORMAL' && (
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              {breathing.status === 'NORMAL' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    breathing.status === 'CRITICAL'
                      ? 'text-red-700'
                      : breathing.status === 'ABNORMAL'
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}
                >
                  {breathing.status === 'CRITICAL' && 'CZERWONY! 🔴'}
                  {breathing.status === 'ABNORMAL' && 'POMARAŃCZOWY ⚠️'}
                  {breathing.status === 'NORMAL' && 'ZIELONY ✅'}
                </p>
                {breathing.alert && (
                  <p
                    className={`text-sm ${
                      breathing.status === 'CRITICAL'
                        ? 'text-red-600'
                        : breathing.status === 'ABNORMAL'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {breathing.alert}
                  </p>
                )}
                {breathing.status === 'CRITICAL' && (
                  <p className="text-sm text-red-600 mt-1">
                    → <strong>Przejdź do sekcji RKO.</strong>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Przycisk dalej */}
      {canProceed && breathing.status !== 'CRITICAL' && (
        <Button onClick={onNext} className="w-full">
          Przejdź do Circulation (Krążenie)
        </Button>
      )}

      {breathing.status === 'CRITICAL' && (
        <div className="p-4 bg-red-100 border-2 border-red-500 rounded-md">
          <p className="text-red-800 font-semibold text-center">
            ⚠️ NATYCHMIAST ROZPOCZNIJ RKO! Nie przechodź dalej.
          </p>
        </div>
      )}
    </div>
  );
}

