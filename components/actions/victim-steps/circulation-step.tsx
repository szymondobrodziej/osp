'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  VictimAssessment,
  CirculationAssessment,
  CIRCULATION_BLEEDING,
  CIRCULATION_PULSE_QUALITY,
} from '@/types/victim';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface CirculationStepProps {
  assessment: VictimAssessment;
  onUpdate: (circulation: CirculationAssessment) => void;
  onNext: () => void;
}

export function CirculationStep({ assessment, onUpdate, onNext }: CirculationStepProps) {
  const circulation = assessment.circulation!;
  const [pulseInput, setPulseInput] = useState<string>(
    circulation.pulseRate?.toString() || ''
  );

  // Pytanie A: Krwawienie
  const handleBleedingSelect = (
    bleeding: 'NONE' | 'PRESENT' | 'SEVERE'
  ) => {
    const option = CIRCULATION_BLEEDING[bleeding];
    onUpdate({
      ...circulation,
      bleeding,
      bleeding_alert: option.severity !== 'GREEN' ? option.alert : undefined,
    });
  };

  // Pytanie B: Tętno (liczba)
  const handlePulseRateChange = (value: string) => {
    setPulseInput(value);
    const rate = parseInt(value, 10);
    if (!isNaN(rate) && rate >= 0) {
      onUpdate({
        ...circulation,
        pulseRate: rate,
      });
    }
  };

  // Pytanie C: Jakość tętna
  const handlePulseQualitySelect = (
    quality: 'NORMAL' | 'FAST' | 'SLOW' | 'WEAK' | 'ABSENT'
  ) => {
    const option = CIRCULATION_PULSE_QUALITY[quality];
    onUpdate({
      ...circulation,
      pulseQuality: quality,
      status: option.severity === 'RED' ? 'CRITICAL' : option.severity === 'YELLOW' ? 'ABNORMAL' : 'NORMAL',
      alert: option.severity !== 'GREEN' ? option.alert : undefined,
    });
  };

  // Pytanie D: Objawy wstrząsu
  const handleShockSigns = (hasShock: boolean) => {
    onUpdate({
      ...circulation,
      shockSigns: hasShock,
    });
  };

  const canProceed =
    circulation.bleeding !== null &&
    circulation.pulseRate !== null &&
    circulation.pulseQuality !== null &&
    circulation.shockSigns !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">C – Circulation (Krążenie)</h3>
        <p className="text-sm text-muted-foreground">
          Ocena krwawienia, tętna i objawów wstrząsu.
        </p>
      </div>

      {/* Pytanie A: Krwawienie */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Pytanie A: Krwawienie</h4>
        <p className="text-sm mb-4">Krwawienia (Wybór: BRAK / ŻYLNE / TĘTNICZE)</p>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={circulation.bleeding === 'NONE' ? 'default' : 'outline'}
            onClick={() => handleBleedingSelect('NONE')}
          >
            BRAK
          </Button>
          <Button
            variant={circulation.bleeding === 'PRESENT' ? 'default' : 'outline'}
            onClick={() => handleBleedingSelect('PRESENT')}
          >
            ŻYLNE / TĘTNICZE
          </Button>
          <Button
            variant={circulation.bleeding === 'SEVERE' ? 'default' : 'outline'}
            onClick={() => handleBleedingSelect('SEVERE')}
          >
            TĘTNICZE
          </Button>
        </div>

        {circulation.bleeding_alert && (
          <div
            className={`mt-4 p-3 rounded-md flex items-start gap-2 ${
              circulation.bleeding === 'SEVERE'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {circulation.bleeding === 'SEVERE' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  circulation.bleeding === 'SEVERE' ? 'text-red-700' : 'text-yellow-700'
                }`}
              >
                {circulation.bleeding === 'SEVERE' ? 'CZERWONY! 🔴' : 'POMARAŃCZOWY ⚠️'}
              </p>
              <p
                className={`text-sm ${
                  circulation.bleeding === 'SEVERE' ? 'text-red-600' : 'text-yellow-600'
                }`}
              >
                {circulation.bleeding_alert}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Pytanie B: Tętno (liczba) */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Pytanie B: Tętno</h4>
        <div>
          <Label htmlFor="pulse-rate">Wartość tętna (uderzenia/min)</Label>
          <Input
            id="pulse-rate"
            type="number"
            min="0"
            max="250"
            value={pulseInput}
            onChange={(e) => handlePulseRateChange(e.target.value)}
            placeholder="Wprowadź wartość tętna..."
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Pole do wpisania liczby (np. 72, 120)
          </p>
        </div>
      </Card>

      {/* Pytanie C: Jakość tętna */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Pytanie C: Jakość tętna</h4>
        <p className="text-sm mb-4">
          Wybierz (Wybór: PRAWIDŁE / SZYBKIE / WOLNE / NITKOWATE / NIEOBECNE)
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            Object.keys(CIRCULATION_PULSE_QUALITY) as Array<
              keyof typeof CIRCULATION_PULSE_QUALITY
            >
          ).map((quality) => (
            <Button
              key={quality}
              variant={circulation.pulseQuality === quality ? 'default' : 'outline'}
              onClick={() => handlePulseQualitySelect(quality)}
            >
              {CIRCULATION_PULSE_QUALITY[quality].label}
            </Button>
          ))}
        </div>

        {circulation.pulseQuality && circulation.alert && (
          <div
            className={`mt-4 p-3 rounded-md flex items-start gap-2 ${
              CIRCULATION_PULSE_QUALITY[circulation.pulseQuality].severity === 'RED'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {CIRCULATION_PULSE_QUALITY[circulation.pulseQuality].severity === 'RED' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  CIRCULATION_PULSE_QUALITY[circulation.pulseQuality].severity === 'RED'
                    ? 'text-red-700'
                    : 'text-yellow-700'
                }`}
              >
                {CIRCULATION_PULSE_QUALITY[circulation.pulseQuality].severity === 'RED'
                  ? 'CZERWONY! 🔴'
                  : 'POMARAŃCZOWY ⚠️'}
              </p>
              <p
                className={`text-sm ${
                  CIRCULATION_PULSE_QUALITY[circulation.pulseQuality].severity === 'RED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {circulation.alert}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Pytanie D: Objawy wstrząsu */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Pytanie D: Objawy wstrząsu</h4>
        <p className="text-sm mb-4">Objawy wstrząsu (Wybór: TAK / NIE)</p>
        <div className="flex gap-3">
          <Button
            variant={circulation.shockSigns === false ? 'default' : 'outline'}
            onClick={() => handleShockSigns(false)}
            className="flex-1"
          >
            NIE
          </Button>
          <Button
            variant={circulation.shockSigns === true ? 'default' : 'outline'}
            onClick={() => handleShockSigns(true)}
            className="flex-1"
          >
            TAK
          </Button>
        </div>
      </Card>

      {/* Przycisk dalej */}
      {canProceed && circulation.pulseQuality !== 'ABSENT' && (
        <Button onClick={onNext} className="w-full">
          Przejdź do następnego kroku
        </Button>
      )}

      {circulation.pulseQuality === 'ABSENT' && (
        <div className="p-4 bg-red-100 border-2 border-red-500 rounded-md">
          <p className="text-red-800 font-semibold text-center">
            ⚠️ NATYCHMIAST ROZPOCZNIJ RKO! Nie przechodź dalej.
          </p>
        </div>
      )}
    </div>
  );
}

