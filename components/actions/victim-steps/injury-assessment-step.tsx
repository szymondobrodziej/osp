'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  VictimAssessment,
  BodyArea,
  BodyAreaAssessment,
  BODY_AREAS,
} from '@/types/victim';
import { CheckCircle } from 'lucide-react';

interface InjuryAssessmentStepProps {
  assessment: VictimAssessment;
  onUpdate: (injuryAssessment: Record<BodyArea, BodyAreaAssessment>) => void;
  onNext: () => void;
}

export function InjuryAssessmentStep({
  assessment,
  onUpdate,
  onNext,
}: InjuryAssessmentStepProps) {
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const areas = Object.keys(BODY_AREAS) as BodyArea[];
  const currentArea = areas[currentAreaIndex];

  const [findings, setFindings] = useState<Record<BodyArea, string>>(
    () =>
      areas.reduce(
        (acc, area) => ({
          ...acc,
          [area]: assessment.injuryAssessment?.[area]?.findings || '',
        }),
        {} as Record<BodyArea, string>
      )
  );

  const [notes, setNotes] = useState<Record<BodyArea, string>>(
    () =>
      areas.reduce(
        (acc, area) => ({
          ...acc,
          [area]: assessment.injuryAssessment?.[area]?.notes || '',
        }),
        {} as Record<BodyArea, string>
      )
  );

  const handleFindingsChange = (area: BodyArea, value: string) => {
    setFindings((prev) => ({ ...prev, [area]: value }));
  };

  const handleNotesChange = (area: BodyArea, value: string) => {
    setNotes((prev) => ({ ...prev, [area]: value }));
  };

  const handleNext = () => {
    if (currentAreaIndex < areas.length - 1) {
      setCurrentAreaIndex((prev) => prev + 1);
    } else {
      // Zapisz wszystkie obszary
      const injuryAssessment = areas.reduce(
        (acc, area) => ({
          ...acc,
          [area]: {
            area,
            label: BODY_AREAS[area].label,
            questions: BODY_AREAS[area].questions,
            findings: findings[area],
            notes: notes[area],
          },
        }),
        {} as Record<BodyArea, BodyAreaAssessment>
      );
      onUpdate(injuryAssessment);
      onNext();
    }
  };

  const handleBack = () => {
    if (currentAreaIndex > 0) {
      setCurrentAreaIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          V. Badanie Urazowe (Ocena Urazowa "Head-to-Toe")
        </h3>
        <p className="text-sm text-muted-foreground">
          Ta sekcja powinna być dostępna w przypadku poszkodowanego nieprzytomnego lub po
          stabilizacji ABC. Umożliwia szczegółową ocenę z możliwością odnotowania
          nieprawidłowości.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          Obszar {currentAreaIndex + 1} z {areas.length}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((currentAreaIndex + 1) / areas.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Area */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">{BODY_AREAS[currentArea].label}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {BODY_AREAS[currentArea].questions}
            </p>
          </div>

          <div>
            <Label htmlFor={`findings-${currentArea}`}>
              Pole do Wprowadzenia Notatek / Checkbox
            </Label>
            <Textarea
              id={`findings-${currentArea}`}
              value={findings[currentArea]}
              onChange={(e) => handleFindingsChange(currentArea, e.target.value)}
              placeholder="Wpisz obserwacje lub zaznacz TAK/NIE..."
              className="mt-2 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Pole tekstowe / TAK/NIE - możesz wpisać szczegóły lub zaznaczyć obecność/brak
              nieprawidłowości
            </p>
          </div>

          <div>
            <Label htmlFor={`notes-${currentArea}`}>Dodatkowe Notatki (opcjonalne)</Label>
            <Textarea
              id={`notes-${currentArea}`}
              value={notes[currentArea]}
              onChange={(e) => handleNotesChange(currentArea, e.target.value)}
              placeholder="Dodatkowe uwagi..."
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentAreaIndex === 0}>
          Wstecz
        </Button>
        <Button onClick={handleNext}>
          {currentAreaIndex < areas.length - 1 ? (
            'Następny obszar'
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Zakończ badanie urazowe
            </>
          )}
        </Button>
      </div>

      {/* Areas checklist */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 text-sm">Postęp badania:</h4>
        <div className="grid grid-cols-2 gap-2">
          {areas.map((area, idx) => (
            <div
              key={area}
              className={`flex items-center gap-2 text-sm ${
                idx < currentAreaIndex
                  ? 'text-green-600'
                  : idx === currentAreaIndex
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
              }`}
            >
              {idx < currentAreaIndex && <CheckCircle className="w-4 h-4" />}
              {idx === currentAreaIndex && <span className="w-4 h-4">→</span>}
              {idx > currentAreaIndex && <span className="w-4 h-4">○</span>}
              <span>{BODY_AREAS[area].label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

