'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VictimAssessment, SAMPLEAssessment } from '@/types/victim';
import { CheckCircle } from 'lucide-react';

interface SAMPLEStepProps {
  assessment: VictimAssessment;
  onUpdate: (sample: SAMPLEAssessment) => void;
  onNext: () => void;
}

const SAMPLE_FIELDS = [
  {
    key: 'S_symptoms' as keyof SAMPLEAssessment,
    label: 'S – Symptoms (Objawy)',
    placeholder: 'Jakie są objawy? (np. ból, zawroty głowy, nudności...)',
  },
  {
    key: 'A_allergies' as keyof SAMPLEAssessment,
    label: 'A – Allergies (Alergie)',
    placeholder: 'Czy poszkodowany ma jakieś alergie? (np. leki, pokarmy...)',
  },
  {
    key: 'M_medications' as keyof SAMPLEAssessment,
    label: 'M – Medications (Leki)',
    placeholder: 'Jakie leki przyjmuje poszkodowany?',
  },
  {
    key: 'P_pastMedicalHistory' as keyof SAMPLEAssessment,
    label: 'P – Past Medical History (Przeszłość Medyczna)',
    placeholder: 'Czy poszkodowany ma jakieś choroby przewlekłe lub przebyte operacje?',
  },
  {
    key: 'L_lastOralIntake' as keyof SAMPLEAssessment,
    label: 'L – Last Oral Intake (Ostatni Posiłek)',
    placeholder: 'Kiedy poszkodowany ostatnio jadł lub pił?',
  },
  {
    key: 'E_events' as keyof SAMPLEAssessment,
    label: 'E – Events (Wydarzenia Prowadzące do Urazu)',
    placeholder: 'Co się stało? Jak doszło do urazu?',
  },
];

export function SAMPLEStep({ assessment, onUpdate, onNext }: SAMPLEStepProps) {
  const sample = assessment.sample!;

  const handleFieldChange = (key: keyof SAMPLEAssessment, value: string) => {
    onUpdate({
      ...sample,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">SAMPLE (Historia Medyczna)</h3>
        <p className="text-sm text-muted-foreground">
          Zbierz informacje o historii medycznej poszkodowanego. Wszystkie pola są opcjonalne.
        </p>
      </div>

      <div className="space-y-4">
        {SAMPLE_FIELDS.map((field) => (
          <Card key={field.key} className="p-4">
            <div>
              <Label htmlFor={field.key} className="text-base font-semibold">
                {field.label}
              </Label>
              <Textarea
                id={field.key}
                value={sample[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="mt-2 min-h-[80px]"
              />
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} className="w-full">
        <CheckCircle className="w-4 h-4 mr-2" />
        Zakończ i przejdź do podsumowania
      </Button>
    </div>
  );
}

