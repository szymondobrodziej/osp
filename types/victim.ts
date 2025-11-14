/**
 * MODUŁ POSZKODOWANI - DOKUMENTACJA MEDYCZNA
 * System zbierania i dokumentowania danych medycznych o poszkodowanym
 * do przekazania ZRM-owi
 */

// ============================================================================
// I. PODSTAWOWE DANE
// ============================================================================

export type AgeGroup = 'ADULT' | 'CHILD' | 'INFANT';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  ADULT: 'Dorosły',
  CHILD: 'Dziecko',
  INFANT: 'Niemowlę',
};

// ============================================================================
// II. STAN ŚWIADOMOŚCI (ACVPU)
// ============================================================================

export type ConsciousnessLevel = 'A' | 'C' | 'V' | 'P' | 'U';

export const CONSCIOUSNESS_LABELS: Record<ConsciousnessLevel, string> = {
  A: 'Przytomny (Alert)',
  C: 'Zdezorientowany (Confusion)',
  V: 'Reaguje na głos (Voice)',
  P: 'Reaguje na ból (Pain)',
  U: 'Nie reaguje (Unresponsive)',
};

// ============================================================================
// III. PARAMETRY ŻYCIOWE (VITAL SIGNS)
// ============================================================================

export interface VitalSigns {
  // Oddech
  respiratoryRate: number | null; // Oddechów na minutę
  respiratoryRateNote?: string; // Np. "1 oddech na 10 sekund"

  // Tętno
  pulseRate: number | null; // Uderzeń na minutę
  pulseQuality: 'NORMAL' | 'WEAK' | 'STRONG' | 'IRREGULAR' | 'ABSENT' | null;

  // Saturacja (jeśli mamy pulsoksymetr)
  oxygenSaturation: number | null; // % SpO2

  // Temperatura (jeśli mamy termometr)
  temperature: number | null; // °C

  // Ciśnienie krwi (jeśli mamy ciśnieniomierz)
  bloodPressureSystolic: number | null; // mmHg
  bloodPressureDiastolic: number | null; // mmHg

  // Czas pomiaru
  measuredAt: Date | null;
}

// Funkcja walidacji oddechów - automatyczne alerty
export function validateRespiratoryRate(rate: number, ageGroup: AgeGroup): {
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
  alert?: string;
} {
  if (rate === 0) {
    return {
      status: 'CRITICAL',
      alert: '🔴 BRAK ODDECHU - ROZPOCZNIJ NATYCHMIAST REANIMACJĘ!',
    };
  }

  // Normy dla dorosłych: 12-20/min
  if (ageGroup === 'ADULT') {
    if (rate < 10) {
      return {
        status: 'CRITICAL',
        alert: '🔴 ODDECH ZBYT WOLNY - Ryzyko zatrzymania oddechu!',
      };
    }
    if (rate < 12 || rate > 20) {
      return {
        status: 'ABNORMAL',
        alert: '⚠️ Oddech poza normą (12-20/min)',
      };
    }
    return { status: 'NORMAL' };
  }

  // Normy dla dzieci: 20-30/min
  if (ageGroup === 'CHILD') {
    if (rate < 15 || rate > 40) {
      return {
        status: 'ABNORMAL',
        alert: '⚠️ Oddech poza normą (20-30/min)',
      };
    }
    return { status: 'NORMAL' };
  }

  // Normy dla niemowląt: 30-60/min
  if (ageGroup === 'INFANT') {
    if (rate < 25 || rate > 70) {
      return {
        status: 'ABNORMAL',
        alert: '⚠️ Oddech poza normą (30-60/min)',
      };
    }
    return { status: 'NORMAL' };
  }

  return { status: 'NORMAL' };
}

// Funkcja walidacji tętna
export function validatePulseRate(rate: number, ageGroup: AgeGroup): {
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
  alert?: string;
} {
  if (rate === 0) {
    return {
      status: 'CRITICAL',
      alert: '🔴 BRAK TĘTNA - ROZPOCZNIJ NATYCHMIAST REANIMACJĘ!',
    };
  }

  // Normy dla dorosłych: 60-100/min
  if (ageGroup === 'ADULT') {
    if (rate < 50) {
      return {
        status: 'ABNORMAL',
        alert: '⚠️ Tętno zbyt wolne (bradykardia)',
      };
    }
    if (rate > 120) {
      return {
        status: 'ABNORMAL',
        alert: '⚠️ Tętno zbyt szybkie (tachykardia)',
      };
    }
    return { status: 'NORMAL' };
  }

  return { status: 'NORMAL' };
}

// ============================================================================
// IV. URAZY I STWIERDZONE PROBLEMY
// ============================================================================

export type InjuryType =
  | 'FRACTURE' // Złamanie
  | 'DISLOCATION' // Zwichnięcie
  | 'WOUND' // Rana
  | 'BURN' // Oparzenie
  | 'BLEEDING' // Krwawienie
  | 'HEAD_INJURY' // Uraz głowy
  | 'SPINAL_INJURY' // Uraz kręgosłupa
  | 'CHEST_INJURY' // Uraz klatki piersiowej
  | 'ABDOMINAL_INJURY' // Uraz brzucha
  | 'OTHER'; // Inny

export const INJURY_TYPE_LABELS: Record<InjuryType, string> = {
  FRACTURE: 'Złamanie',
  DISLOCATION: 'Zwichnięcie',
  WOUND: 'Rana',
  BURN: 'Oparzenie',
  BLEEDING: 'Krwawienie',
  HEAD_INJURY: 'Uraz głowy',
  SPINAL_INJURY: 'Uraz kręgosłupa',
  CHEST_INJURY: 'Uraz klatki piersiowej',
  ABDOMINAL_INJURY: 'Uraz brzucha',
  OTHER: 'Inny',
};

export type BodyPart =
  | 'HEAD' // Głowa
  | 'NECK' // Szyja
  | 'CHEST' // Klatka piersiowa
  | 'ABDOMEN' // Brzuch
  | 'PELVIS' // Miednica
  | 'BACK' // Plecy
  | 'LEFT_ARM' // Lewa ręka
  | 'RIGHT_ARM' // Prawa ręka
  | 'LEFT_LEG' // Lewa noga
  | 'RIGHT_LEG' // Prawa noga
  | 'OTHER'; // Inne

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  HEAD: 'Głowa',
  NECK: 'Szyja',
  CHEST: 'Klatka piersiowa',
  ABDOMEN: 'Brzuch',
  PELVIS: 'Miednica',
  BACK: 'Plecy',
  LEFT_ARM: 'Lewa ręka',
  RIGHT_ARM: 'Prawa ręka',
  LEFT_LEG: 'Lewa noga',
  RIGHT_LEG: 'Prawa noga',
  OTHER: 'Inne',
};

export interface Injury {
  id: string;
  type: InjuryType;
  bodyPart: BodyPart;
  description: string; // Np. "Złamanie prawej goleni"
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  createdAt: Date;
}

// ============================================================================
// V. DZIAŁANIA PODJĘTE
// ============================================================================

export type ActionType =
  | 'AIRWAY_CLEARANCE' // Udrożnienie dróg oddechowych
  | 'CPR' // Reanimacja
  | 'BLEEDING_CONTROL' // Tamowanie krwotoku
  | 'IMMOBILIZATION' // Unieruchomienie
  | 'WOUND_DRESSING' // Opatrzenie rany
  | 'OXYGEN_THERAPY' // Tlenoterapia
  | 'RECOVERY_POSITION' // Pozycja boczna ustalona
  | 'SHOCK_POSITION' // Pozycja przeciwwstrząsowa
  | 'THERMAL_PROTECTION' // Zabezpieczenie termiczne
  | 'AED_USE' // Użycie AED
  | 'OTHER'; // Inne

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  AIRWAY_CLEARANCE: 'Udrożnienie dróg oddechowych',
  CPR: 'Reanimacja (RKO)',
  BLEEDING_CONTROL: 'Tamowanie krwotoku',
  IMMOBILIZATION: 'Unieruchomienie',
  WOUND_DRESSING: 'Opatrzenie rany',
  OXYGEN_THERAPY: 'Tlenoterapia',
  RECOVERY_POSITION: 'Pozycja boczna ustalona',
  SHOCK_POSITION: 'Pozycja przeciwwstrząsowa',
  THERMAL_PROTECTION: 'Zabezpieczenie termiczne (koc)',
  AED_USE: 'Użycie AED',
  OTHER: 'Inne działanie',
};

export interface ActionTaken {
  id: string;
  type: ActionType;
  description: string; // Np. "Unieruchomienie prawej nogi szynami Kramera"
  time: Date;
  performedBy?: string; // Kto wykonał
}

// ============================================================================
// VI. WYWIAD (SAMPLE)
// ============================================================================

export interface SAMPLEInterview {
  symptoms: string; // S - Objawy (co boli, co się stało)
  allergies: string; // A - Alergie
  medications: string; // M - Leki (jakie przyjmuje)
  pastMedicalHistory: string; // P - Przeszłość medyczna (choroby przewlekłe)
  lastOralIntake: string; // L - Ostatni posiłek (kiedy i co jadł/pił)
  events: string; // E - Zdarzenie (co się stało, mechanizm urazu)
}

// ============================================================================
// VII. INFORMACJE OD ŚWIADKÓW/RODZINY
// ============================================================================

export interface WitnessInformation {
  id: string;
  source: string; // Kto przekazał (np. "Żona poszkodowanego", "Świadek zdarzenia")
  information: string; // Treść informacji
  time: Date;
}

// ============================================================================
// VIII. GŁÓWNA STRUKTURA - DOKUMENTACJA MEDYCZNA POSZKODOWANEGO
// ============================================================================

export interface VictimMedicalRecord {
  id: string;
  casualtyId: string; // ID poszkodowanego z casualties-list
  createdAt: Date;
  updatedAt: Date;

  // Podstawowe dane
  ageGroup: AgeGroup | null;
  consciousness: ConsciousnessLevel | null;

  // Parametry życiowe (można dodawać wiele pomiarów w czasie)
  vitalSigns: VitalSigns[];

  // Stwierdzone urazy
  injuries: Injury[];

  // Podjęte działania
  actionsTaken: ActionTaken[];

  // Wywiad SAMPLE
  sample: SAMPLEInterview;

  // Informacje od świadków/rodziny
  witnessInfo: WitnessInformation[];

  // Dodatkowe notatki
  additionalNotes: string;

  // Status ogólny
  overallStatus: 'STABLE' | 'UNSTABLE' | 'CRITICAL';
}

// ============================================================================
// IX. FUNKCJE POMOCNICZE
// ============================================================================

export function createEmptyVictimRecord(casualtyId: string): VictimMedicalRecord {
  return {
    id: crypto.randomUUID(),
    casualtyId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ageGroup: null,
    consciousness: null,
    vitalSigns: [],
    injuries: [],
    actionsTaken: [],
    sample: {
      symptoms: '',
      allergies: '',
      medications: '',
      pastMedicalHistory: '',
      lastOralIntake: '',
      events: '',
    },
    witnessInfo: [],
    additionalNotes: '',
    overallStatus: 'STABLE',
  };
}

export function createVitalSignsEntry(): VitalSigns {
  return {
    respiratoryRate: null,
    pulseRate: null,
    pulseQuality: null,
    oxygenSaturation: null,
    temperature: null,
    bloodPressureSystolic: null,
    bloodPressureDiastolic: null,
    measuredAt: new Date(),
  };
}

export function createInjury(
  type: InjuryType,
  bodyPart: BodyPart,
  description: string,
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
): Injury {
  return {
    id: crypto.randomUUID(),
    type,
    bodyPart,
    description,
    severity,
    createdAt: new Date(),
  };
}

export function createAction(
  type: ActionType,
  description: string,
  performedBy?: string
): ActionTaken {
  return {
    id: crypto.randomUUID(),
    type,
    description,
    time: new Date(),
    performedBy,
  };
}

export function createWitnessInfo(source: string, information: string): WitnessInformation {
  return {
    id: crypto.randomUUID(),
    source,
    information,
    time: new Date(),
  };
}

