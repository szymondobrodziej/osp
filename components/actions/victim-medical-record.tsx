'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VictimMedicalRecord,
  AgeGroup,
  ConsciousnessLevel,
  VitalSigns,
  Injury,
  ActionTaken,
  AGE_GROUP_LABELS,
  CONSCIOUSNESS_LABELS,
  INJURY_TYPE_LABELS,
  BODY_PART_LABELS,
  ACTION_TYPE_LABELS,
  InjuryType,
  BodyPart,
  ActionType,
  createEmptyVictimRecord,
  createVitalSignsEntry,
  createInjury,
  createAction,
  createWitnessInfo,
  validateRespiratoryRate,
  validatePulseRate,
} from '@/types/victim';
import {
  Activity,
  Heart,
  Thermometer,
  Droplet,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  FileText,
} from 'lucide-react';

interface VictimMedicalRecordProps {
  casualtyId: string;
  casualtyName: string;
  onSave: (record: VictimMedicalRecord) => void;
  initialRecord?: VictimMedicalRecord;
}

export function VictimMedicalRecordComponent({
  casualtyId,
  casualtyName,
  onSave,
  initialRecord,
}: VictimMedicalRecordProps) {
  const [record, setRecord] = useState<VictimMedicalRecord>(
    initialRecord || createEmptyVictimRecord(casualtyId)
  );

  const [currentVitalSigns, setCurrentVitalSigns] = useState<VitalSigns>(
    createVitalSignsEntry()
  );

  // Dodaj pomiar parametrów życiowych
  const handleAddVitalSigns = () => {
    if (
      currentVitalSigns.respiratoryRate === null &&
      currentVitalSigns.pulseRate === null &&
      currentVitalSigns.oxygenSaturation === null
    ) {
      alert('Wprowadź przynajmniej jeden parametr');
      return;
    }

    setRecord({
      ...record,
      vitalSigns: [...record.vitalSigns, { ...currentVitalSigns, measuredAt: new Date() }],
      updatedAt: new Date(),
    });
    setCurrentVitalSigns(createVitalSignsEntry());
  };

  // Walidacja oddechów
  const getRespiratoryAlert = () => {
    if (currentVitalSigns.respiratoryRate === null || record.ageGroup === null) return null;
    return validateRespiratoryRate(currentVitalSigns.respiratoryRate, record.ageGroup);
  };

  // Walidacja tętna
  const getPulseAlert = () => {
    if (currentVitalSigns.pulseRate === null || record.ageGroup === null) return null;
    return validatePulseRate(currentVitalSigns.pulseRate, record.ageGroup);
  };

  const respiratoryAlert = getRespiratoryAlert();
  const pulseAlert = getPulseAlert();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Dokumentacja Medyczna</h2>
          <p className="text-sm text-gray-600">{casualtyName}</p>
        </div>
        <Button onClick={() => onSave(record)} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Zapisz
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Podstawowe</TabsTrigger>
          <TabsTrigger value="vitals">Parametry</TabsTrigger>
          <TabsTrigger value="injuries">Urazy</TabsTrigger>
          <TabsTrigger value="actions">Działania</TabsTrigger>
          <TabsTrigger value="interview">Wywiad</TabsTrigger>
        </TabsList>

        {/* ZAKŁADKA 1: PODSTAWOWE DANE */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Podstawowe informacje</h3>
            
            <div className="space-y-3">
              {/* Grupa wiekowa */}
              <div>
                <Label>Grupa wiekowa</Label>
                <div className="flex gap-2 mt-2">
                  {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((age) => (
                    <Button
                      key={age}
                      variant={record.ageGroup === age ? 'default' : 'outline'}
                      onClick={() =>
                        setRecord({ ...record, ageGroup: age, updatedAt: new Date() })
                      }
                      className="flex-1"
                    >
                      {AGE_GROUP_LABELS[age]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Stan świadomości */}
              <div>
                <Label>Stan świadomości (ACVPU)</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {(Object.keys(CONSCIOUSNESS_LABELS) as ConsciousnessLevel[]).map((level) => (
                    <Button
                      key={level}
                      variant={record.consciousness === level ? 'default' : 'outline'}
                      onClick={() =>
                        setRecord({ ...record, consciousness: level, updatedAt: new Date() })
                      }
                      className={
                        level === 'U'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : level === 'V' || level === 'P'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : ''
                      }
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                {record.consciousness && (
                  <p className="text-sm text-gray-600 mt-2">
                    {CONSCIOUSNESS_LABELS[record.consciousness]}
                  </p>
                )}
              </div>

              {/* Status ogólny */}
              <div>
                <Label>Status ogólny</Label>
                <div className="flex gap-2 mt-2">
                  {(['STABLE', 'UNSTABLE', 'CRITICAL'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={record.overallStatus === status ? 'default' : 'outline'}
                      onClick={() =>
                        setRecord({ ...record, overallStatus: status, updatedAt: new Date() })
                      }
                      className={
                        status === 'CRITICAL'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : status === 'UNSTABLE'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-green-600 hover:bg-green-700'
                      }
                    >
                      {status === 'STABLE'
                        ? 'Stabilny'
                        : status === 'UNSTABLE'
                        ? 'Niestabilny'
                        : 'Krytyczny'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ZAKŁADKA 2: PARAMETRY ŻYCIOWE */}
        <TabsContent value="vitals" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Nowy pomiar parametrów życiowych
            </h3>

            {!record.ageGroup && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Wybierz najpierw grupę wiekową w zakładce "Podstawowe" aby otrzymać
                  automatyczne alerty
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Oddech */}
              <div>
                <Label className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Oddech (oddechów/min)
                </Label>
                <Input
                  type="number"
                  value={currentVitalSigns.respiratoryRate ?? ''}
                  onChange={(e) =>
                    setCurrentVitalSigns({
                      ...currentVitalSigns,
                      respiratoryRate: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="np. 16"
                />
                <Input
                  type="text"
                  value={currentVitalSigns.respiratoryRateNote ?? ''}
                  onChange={(e) =>
                    setCurrentVitalSigns({
                      ...currentVitalSigns,
                      respiratoryRateNote: e.target.value,
                    })
                  }
                  placeholder="Notatka (np. 1 oddech na 10 sek)"
                  className="mt-2"
                />
                {respiratoryAlert && respiratoryAlert.alert && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${
                      respiratoryAlert.status === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}
                  >
                    {respiratoryAlert.alert}
                  </div>
                )}
              </div>

              {/* Tętno */}
              <div>
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Tętno (uderzeń/min)
                </Label>
                <Input
                  type="number"
                  value={currentVitalSigns.pulseRate ?? ''}
                  onChange={(e) =>
                    setCurrentVitalSigns({
                      ...currentVitalSigns,
                      pulseRate: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="np. 80"
                />
                <select
                  value={currentVitalSigns.pulseQuality ?? ''}
                  onChange={(e) =>
                    setCurrentVitalSigns({
                      ...currentVitalSigns,
                      pulseQuality: e.target.value as any,
                    })
                  }
                  className="mt-2 w-full border rounded px-3 py-2"
                >
                  <option value="">Jakość tętna...</option>
                  <option value="NORMAL">Prawidłowe</option>
                  <option value="WEAK">Słabe</option>
                  <option value="STRONG">Mocne</option>
                  <option value="IRREGULAR">Nieregularne</option>
                  <option value="ABSENT">Nieobecne</option>
                </select>
                {pulseAlert && pulseAlert.alert && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${
                      pulseAlert.status === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}
                  >
                    {pulseAlert.alert}
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleAddVitalSigns} className="mt-4 w-full">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj pomiar
            </Button>
          </Card>

          {/* Historia pomiarów */}
          {record.vitalSigns.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Historia pomiarów</h3>
              <div className="space-y-2">
                {record.vitalSigns.map((vs, idx) => (
                  <div key={idx} className="border rounded p-3 text-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        {vs.respiratoryRate && (
                          <p>
                            <Activity className="w-3 h-3 inline mr-1" />
                            Oddech: {vs.respiratoryRate}/min
                            {vs.respiratoryRateNote && ` (${vs.respiratoryRateNote})`}
                          </p>
                        )}
                        {vs.pulseRate && (
                          <p>
                            <Heart className="w-3 h-3 inline mr-1" />
                            Tętno: {vs.pulseRate}/min {vs.pulseQuality && `- ${vs.pulseQuality}`}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {vs.measuredAt ? new Date(vs.measuredAt).toLocaleTimeString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Pozostałe zakładki - placeholder */}
        <TabsContent value="injuries">
          <Card className="p-4">
            <p className="text-gray-500">Zakładka Urazy - w budowie</p>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="p-4">
            <p className="text-gray-500">Zakładka Działania - w budowie</p>
          </Card>
        </TabsContent>

        <TabsContent value="interview">
          <Card className="p-4">
            <p className="text-gray-500">Zakładka Wywiad - w budowie</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

