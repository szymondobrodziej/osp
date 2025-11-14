'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VictimAssessment, AirwayAssessment, AIRWAY_TECHNIQUES } from '@/types/victim';
import { AlertCircle } from 'lucide-react';

interface AirwayStepProps {
  assessment: VictimAssessment;
  onUpdate: (airway: AirwayAssessment) => void;
  onNext: () => void;
}

export function AirwayStep({ assessment, onUpdate, onNext }: AirwayStepProps) {
  const airway = assessment.airway!;

  // KROK 1: Kontrola i usunięcie ciał obcych
  const handleStep1 = (hasForeignBodies: boolean) => {
    onUpdate({
      ...airway,
      step1_foreignBodies: hasForeignBodies,
      step1_action: hasForeignBodies ? 'REMOVE' : null,
    });
  };

  // KROK 2: Wybór techniki udrażniania
  const handleTechniqueSelect = (technique: 'INJURY' | 'PATENCY_RISK') => {
    onUpdate({
      ...airway,
      step2_technique: technique,
      step2_injury_result: null,
    });
  };

  // KROK 2: Odpowiedź na pytanie o uraz/drożność
  const handleTechniqueAnswer = (answer: boolean) => {
    const technique = airway.step2_technique!;
    const option = answer
      ? AIRWAY_TECHNIQUES[technique].options.YES
      : AIRWAY_TECHNIQUES[technique].options.NO;

    onUpdate({
      ...airway,
      step2_injury_result: answer,
      step2_injury_action: option.action as 'HEAD_TILT_CHIN_LIFT' | 'JAW_THRUST' | null,
      status: option.severity === 'RED' ? 'CRITICAL' : 'CLEAR',
    });
  };

  const canProceed = airway.step1_foreignBodies !== null && airway.step2_injury_result !== null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">A – Airway (Drogi Oddechowe)</h3>
        <p className="text-sm text-muted-foreground">
          Ocena i udrożnienie dróg oddechowych poszkodowanego.
        </p>
      </div>

      {/* KROK 1: Kontrola ciał obcych */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">KROK 1: KONTROLA I USUNIĘCIE CIAŁ OBCYCH</h4>
        <p className="text-sm mb-4">
          Czy w ustach widoczne są ciała obce, treść pokarmowa lub płyny?
        </p>
        <div className="flex gap-3">
          <Button
            variant={airway.step1_foreignBodies === true ? 'default' : 'outline'}
            onClick={() => handleStep1(true)}
            className="flex-1"
          >
            TAK
          </Button>
          <Button
            variant={airway.step1_foreignBodies === false ? 'default' : 'outline'}
            onClick={() => handleStep1(false)}
            className="flex-1"
          >
            NIE
          </Button>
        </div>

        {airway.step1_foreignBodies === true && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">CZERWONY! 🔴</p>
              <p className="text-sm text-red-600">
                Komunikat: <strong>USUŃ widoczne ciało obce/płyny.</strong>
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* KROK 2: Wybór techniki udrażniania */}
      {airway.step1_foreignBodies !== null && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">KROK 2: WYBÓR TECHNIKI UDRAŻNIANIA</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant={airway.step2_technique === 'INJURY' ? 'default' : 'outline'}
              onClick={() => handleTechniqueSelect('INJURY')}
              className="h-auto py-3"
            >
              <div className="text-center">
                <div className="font-semibold">Uraz</div>
                <div className="text-xs mt-1">Podejrzenie urazu kręgosłupa</div>
              </div>
            </Button>
            <Button
              variant={airway.step2_technique === 'PATENCY_RISK' ? 'default' : 'outline'}
              onClick={() => handleTechniqueSelect('PATENCY_RISK')}
              className="h-auto py-3"
            >
              <div className="text-center">
                <div className="font-semibold">Drożność</div>
                <div className="text-xs mt-1">Kontrola drożności dróg</div>
              </div>
            </Button>
          </div>

          {airway.step2_technique && (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                {AIRWAY_TECHNIQUES[airway.step2_technique].question}
              </p>
              <div className="flex gap-3">
                <Button
                  variant={airway.step2_injury_result === false ? 'default' : 'outline'}
                  onClick={() => handleTechniqueAnswer(false)}
                  className="flex-1"
                >
                  NIE
                </Button>
                <Button
                  variant={airway.step2_injury_result === true ? 'default' : 'outline'}
                  onClick={() => handleTechniqueAnswer(true)}
                  className="flex-1"
                >
                  TAK
                </Button>
                {airway.step2_technique === 'PATENCY_RISK' && (
                  <Button
                    variant="outline"
                    onClick={() => handleTechniqueAnswer(false)}
                    className="flex-1"
                  >
                    Ryzyko niedrożności
                  </Button>
                )}
              </div>

              {airway.step2_injury_result !== null && (
                <div
                  className={`mt-4 p-3 rounded-md flex items-start gap-2 ${
                    AIRWAY_TECHNIQUES[airway.step2_technique].options[
                      airway.step2_injury_result ? 'YES' : 'NO'
                    ].severity === 'RED'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      AIRWAY_TECHNIQUES[airway.step2_technique].options[
                        airway.step2_injury_result ? 'YES' : 'NO'
                      ].severity === 'RED'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        AIRWAY_TECHNIQUES[airway.step2_technique].options[
                          airway.step2_injury_result ? 'YES' : 'NO'
                        ].severity === 'RED'
                          ? 'text-red-700'
                          : 'text-green-700'
                      }`}
                    >
                      {AIRWAY_TECHNIQUES[airway.step2_technique].options[
                        airway.step2_injury_result ? 'YES' : 'NO'
                      ].severity === 'RED'
                        ? 'CZERWONY! 🔴'
                        : 'ZIELONY ✅'}
                    </p>
                    <p
                      className={`text-sm ${
                        AIRWAY_TECHNIQUES[airway.step2_technique].options[
                          airway.step2_injury_result ? 'YES' : 'NO'
                        ].severity === 'RED'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {
                        AIRWAY_TECHNIQUES[airway.step2_technique].options[
                          airway.step2_injury_result ? 'YES' : 'NO'
                        ].alert
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Przycisk dalej */}
      {canProceed && (
        <Button onClick={onNext} className="w-full">
          Przejdź do Breathing (Oddychanie)
        </Button>
      )}
    </div>
  );
}

