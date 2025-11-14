'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  VictimAssessment,
  AgeGroup,
  ACVPULevel,
  AGE_GROUP_LABELS,
  ACVPU_OPTIONS,
  createEmptyVictimAssessment,
  getACVPUOption,
} from '@/types/victim';
import { AlertCircle, CheckCircle, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import { AirwayStep } from './victim-steps/airway-step';
import { BreathingStep } from './victim-steps/breathing-step';
import { CirculationStep } from './victim-steps/circulation-step';
import { InjuryAssessmentStep } from './victim-steps/injury-assessment-step';
import { SAMPLEStep } from './victim-steps/sample-step';

interface VictimAssessmentProps {
  actionId: string;
  onSave?: (assessment: VictimAssessment) => void;
}

type Step =
  | 'AGE_GROUP'
  | 'ACVPU'
  | 'AIRWAY'
  | 'BREATHING'
  | 'CIRCULATION'
  | 'INJURY_ASSESSMENT'
  | 'SAMPLE'
  | 'SUMMARY';

export function VictimAssessmentComponent({ actionId, onSave }: VictimAssessmentProps) {
  const [assessment, setAssessment] = useState<VictimAssessment>(() =>
    createEmptyVictimAssessment(actionId)
  );
  const [currentStep, setCurrentStep] = useState<Step>('AGE_GROUP');

  // ============================================================================
  // KROK 1: WYBÓR GRUPY WIEKOWEJ
  // ============================================================================

  const handleAgeGroupSelect = (ageGroup: AgeGroup) => {
    setAssessment((prev) => ({ ...prev, ageGroup }));
    setCurrentStep('ACVPU');
  };

  // ============================================================================
  // KROK 2: ACVPU
  // ============================================================================

  const handleACVPUSelect = (level: ACVPULevel) => {
    const option = getACVPUOption(level);
    setAssessment((prev) => ({ ...prev, acvpu: level }));

    // Logika przejścia do następnego kroku
    switch (option.nextStep) {
      case 'INJURY_ASSESSMENT':
        setCurrentStep('INJURY_ASSESSMENT');
        break;
      case 'ABC_HEAVY':
      case 'ABC_LIGHT':
      case 'ABC_IMMEDIATE':
        setCurrentStep('AIRWAY');
        break;
      case 'SAMPLE':
        setCurrentStep('SAMPLE');
        break;
    }
  };

  // ============================================================================
  // NAWIGACJA
  // ============================================================================

  const handleNext = () => {
    const stepOrder: Step[] = [
      'AGE_GROUP',
      'ACVPU',
      'AIRWAY',
      'BREATHING',
      'CIRCULATION',
      'INJURY_ASSESSMENT',
      'SAMPLE',
      'SUMMARY',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = [
      'AGE_GROUP',
      'ACVPU',
      'AIRWAY',
      'BREATHING',
      'CIRCULATION',
      'INJURY_ASSESSMENT',
      'SAMPLE',
      'SUMMARY',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    setAssessment((prev) => ({ ...prev, updatedAt: new Date() }));
    onSave?.(assessment);
  };

  // ============================================================================
  // RENDEROWANIE KROKÓW
  // ============================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 'AGE_GROUP':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wybierz Grupę Wiekową</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((group) => (
                <Button
                  key={group}
                  variant={assessment.ageGroup === group ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => handleAgeGroupSelect(group)}
                >
                  {AGE_GROUP_LABELS[group]}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'ACVPU':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ocena Stanu Świadomości (ACVPU)</h3>
            <p className="text-sm text-muted-foreground">
              Użytkownik wybiera stan poszkodowanego:
            </p>
            <div className="space-y-2">
              {ACVPU_OPTIONS.map((option) => (
                <Card
                  key={option.level}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    assessment.acvpu === option.level
                      ? 'border-2 border-primary bg-primary/5'
                      : ''
                  }`}
                  onClick={() => handleACVPUSelect(option.level)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{option.level}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      {option.alert && (
                        <div className="mt-2 flex items-center gap-2">
                          {option.severity === 'RED' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {option.severity === 'YELLOW' && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm font-medium">{option.alert}</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        option.severity === 'RED'
                          ? 'destructive'
                          : option.severity === 'YELLOW'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {option.severity === 'RED' && '🔴 CZERWONY'}
                      {option.severity === 'YELLOW' && '⚠️ POMARAŃCZOWY'}
                      {option.severity === 'GREEN' && '✅ ZIELONY'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'AIRWAY':
        return (
          <AirwayStep
            assessment={assessment}
            onUpdate={(airway) => setAssessment((prev) => ({ ...prev, airway }))}
            onNext={handleNext}
          />
        );

      case 'BREATHING':
        return (
          <BreathingStep
            assessment={assessment}
            onUpdate={(breathing) => setAssessment((prev) => ({ ...prev, breathing }))}
            onNext={handleNext}
          />
        );

      case 'CIRCULATION':
        return (
          <CirculationStep
            assessment={assessment}
            onUpdate={(circulation) => setAssessment((prev) => ({ ...prev, circulation }))}
            onNext={handleNext}
          />
        );

      case 'INJURY_ASSESSMENT':
        return (
          <InjuryAssessmentStep
            assessment={assessment}
            onUpdate={(injuryAssessment) =>
              setAssessment((prev) => ({ ...prev, injuryAssessment }))
            }
            onNext={handleNext}
          />
        );

      case 'SAMPLE':
        return (
          <SAMPLEStep
            assessment={assessment}
            onUpdate={(sample) => setAssessment((prev) => ({ ...prev, sample }))}
            onNext={handleNext}
          />
        );

      case 'SUMMARY':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Podsumowanie Oceny</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Grupa wiekowa:</span>{' '}
                {assessment.ageGroup ? AGE_GROUP_LABELS[assessment.ageGroup] : 'Nie wybrano'}
              </div>
              <div>
                <span className="font-medium">ACVPU:</span>{' '}
                {assessment.acvpu
                  ? getACVPUOption(assessment.acvpu).label
                  : 'Nie oceniono'}
              </div>
              {assessment.criticalAlerts.length > 0 && (
                <Card className="p-4 border-red-500 bg-red-50">
                  <h4 className="font-semibold text-red-700 mb-2">Alerty Krytyczne:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {assessment.criticalAlerts.map((alert, idx) => (
                      <li key={idx} className="text-sm text-red-600">
                        {alert}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
            <Button onClick={handleSave} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Zapisz Ocenę
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">Krok:</span>
        <Badge variant="outline">{currentStep}</Badge>
      </div>

      {/* Content */}
      <Card className="p-6">{renderStepContent()}</Card>

      {/* Navigation */}
      {currentStep !== 'AGE_GROUP' && currentStep !== 'SUMMARY' && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>
          <Button onClick={handleNext}>
            Dalej
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

