/**
 * MODUŁ POSZKODOWANI - PIERWSZA POMOC
 * Typy danych dla oceny stanu poszkodowanego
 */

// ============================================================================
// I. GRUPY WIEKOWE
// ============================================================================

export type AgeGroup = 'ADULTS' | 'CHILDREN' | 'INFANTS' | 'SPECIAL_CASES';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  ADULTS: 'DOROŚLI',
  CHILDREN: 'DZIECI',
  INFANTS: 'NIEMOWLĘTA',
  SPECIAL_CASES: 'PRZYPADKI SPECJALNE',
};

// ============================================================================
// II. ACVPU - OCENA STANU ŚWIADOMOŚCI
// ============================================================================

export type ACVPULevel = 'A' | 'C' | 'V' | 'P' | 'U';

export interface ACVPUOption {
  level: ACVPULevel;
  label: string;
  description: string;
  nextStep: 'INJURY_ASSESSMENT' | 'SAMPLE' | 'ABC_HEAVY' | 'ABC_LIGHT' | 'ABC_IMMEDIATE';
  severity: 'GREEN' | 'YELLOW' | 'RED';
  alert?: string; // Komunikat alarmowy
}

export const ACVPU_OPTIONS: ACVPUOption[] = [
  {
    level: 'A',
    label: 'Alert (Przytomny, reaguje, zorientowany)',
    description: 'Poszkodowany jest przytomny, reaguje na otoczenie, jest zorientowany',
    nextStep: 'INJURY_ASSESSMENT',
    severity: 'GREEN',
  },
  {
    level: 'C',
    label: 'Confusion (Zdezorientowany, senny, splątany)',
    description: 'Poszkodowany jest zdezorientowany, senny lub splątany',
    nextStep: 'INJURY_ASSESSMENT',
    severity: 'GREEN',
  },
  {
    level: 'V',
    label: 'Voice (Reaguje tylko na GŁOS)',
    description: 'Poszkodowany reaguje tylko na bodźce głosowe',
    nextStep: 'ABC_HEAVY',
    severity: 'YELLOW',
    alert: 'Przejdź do: Badanie ABC (stan ciężki)',
  },
  {
    level: 'P',
    label: 'Pain (Reaguje tylko na BÓL)',
    description: 'Poszkodowany reaguje tylko na bodźce bólowe',
    nextStep: 'ABC_LIGHT',
    severity: 'YELLOW',
    alert: 'Przejdź do: Badanie ABC (nieprzytomny)',
  },
  {
    level: 'U',
    label: 'Unresponsive (Nie reaguje na głos ani ból)',
    description: 'Poszkodowany nie reaguje na żadne bodźce',
    nextStep: 'ABC_IMMEDIATE',
    severity: 'RED',
    alert: 'Przejdź natychmiast do: Badanie ABC (A/B). PODEJRZEWAJ NZK!',
  },
];

// ============================================================================
// III. ABC - AIRWAY / BREATHING / CIRCULATION
// ============================================================================

// --- A - AIRWAY (Drogi Oddechowe) ---

export interface AirwayAssessment {
  step1_foreignBodies: boolean | null; // Czy w ustach widoczne są ciała obce?
  step1_action?: 'REMOVE' | null; // CZERWONY! Usuń widoczne ciało obce/płyny
  
  step2_technique: 'INJURY' | 'PATENCY_RISK' | null; // Wybór techniki udrażniania
  step2_injury_result: boolean | null; // Czy występuje podejrzenie urazu kręgosłupa szyjnego?
  step2_injury_action?: 'HEAD_TILT_CHIN_LIFT' | 'JAW_THRUST' | null;
  
  status: 'CLEAR' | 'OBSTRUCTED' | 'CRITICAL' | null;
}

export const AIRWAY_TECHNIQUES = {
  INJURY: {
    label: 'Uraz',
    question: 'Czy występuje podejrzenie urazu kręgosłupa szyjnego?',
    options: {
      NO: {
        label: 'NIE',
        action: 'HEAD_TILT_CHIN_LIFT',
        alert: 'CZERWONY! Udrożnij rękoczynem CZOŁO-ŻUCHWA.',
        severity: 'RED' as const,
      },
      YES: {
        label: 'TAK',
        action: 'JAW_THRUST',
        alert: 'CZERWONY! Udrożnij rękoczynem UNIESIENIA ŻUCHWY (bez odgięcia głowy).',
        severity: 'RED' as const,
      },
    },
  },
  PATENCY_RISK: {
    label: 'Drożność',
    question: 'Czy drogi oddechowe są drożne po kontroli?',
    options: {
      NO: {
        label: 'NIE / Ryzyko niedrożności',
        action: 'HEAD_TILT_CHIN_LIFT',
        alert: 'CZERWONY! Udrożnij rękoczynem CZOŁO-ŻUCHWA.',
        severity: 'RED' as const,
      },
      YES: {
        label: 'TAK',
        action: null,
        alert: 'Drogi oddechowe drożne. Przejdź do Breathing.',
        severity: 'GREEN' as const,
      },
    },
  },
};

// --- B - BREATHING (Oddychanie) ---

export interface BreathingAssessment {
  respiratoryRate: number | null; // Liczba oddechów na minutę (L/min)
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | null;
  alert?: string;
}

export const BREATHING_RANGES = {
  NORMAL: { min: 10, max: 20, label: 'ZIELONY ✅', severity: 'GREEN' as const },
  ABNORMAL: {
    label: 'POMARAŃCZOWY ⚠️',
    severity: 'YELLOW' as const,
    alert: 'Kontynuuj kontrolę.',
  },
  CRITICAL: {
    label: 'CZERWONY! 🔴',
    severity: 'RED' as const,
    alert: 'NATYCHMIAST ROZPOCZNIJ RKO! → Przejdź do sekcji RKO.',
  },
};

// --- C - CIRCULATION (Krążenie) ---

export interface CirculationAssessment {
  // Pytanie A: Krwawienie
  bleeding: 'NONE' | 'PRESENT' | 'SEVERE' | null;
  bleeding_alert?: string;
  
  // Pytanie B: Tętno (uderzenia/min)
  pulseRate: number | null;
  
  // Pytanie C: Jakość tętna
  pulseQuality: 'NORMAL' | 'FAST' | 'SLOW' | 'WEAK' | 'ABSENT' | null;
  
  // Pytanie D: Objawy wstrząsu
  shockSigns: boolean | null;
  
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | null;
  alert?: string;
}

export const CIRCULATION_BLEEDING = {
  NONE: { label: 'BRAK', severity: 'GREEN' as const },
  PRESENT: {
    label: 'ŻYLNE / TĘTNICZE',
    severity: 'YELLOW' as const,
    alert: 'Pozycja przeciwwstrząsowa (o ile nie ma urazu), zabezpieczenie termiczne.',
  },
  SEVERE: {
    label: 'TĘTNICZE',
    severity: 'RED' as const,
    alert: 'TAMUJ KRWOTOK SILNYM, BEZPOŚREDNIM UCIŚKIEM.',
  },
};

export const CIRCULATION_PULSE_QUALITY = {
  NORMAL: { label: 'PRAWIDŁE', severity: 'GREEN' as const, alert: undefined },
  FAST: { label: 'SZYBKIE', severity: 'YELLOW' as const, alert: undefined },
  SLOW: { label: 'WOLNE', severity: 'YELLOW' as const, alert: undefined },
  WEAK: { label: 'NITKOWATE', severity: 'YELLOW' as const, alert: undefined },
  ABSENT: {
    label: 'NIEOBECNE',
    severity: 'RED' as const,
    alert: 'NATYCHMIAST ROZPOCZNIJ RKO!',
  },
};

// ============================================================================
// IV. BADANIE URAZOWE (Head-to-Toe)
// ============================================================================

export type BodyArea =
  | 'HEAD_NECK'
  | 'CHEST'
  | 'ABDOMEN'
  | 'PELVIS'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS'
  | 'BACK';

export interface BodyAreaAssessment {
  area: BodyArea;
  label: string;
  questions: string; // Co sprawdzamy
  findings: string; // Pole tekstowe / TAK/NIE
  notes?: string; // Dodatkowe notatki
}

export const BODY_AREAS: Record<BodyArea, { label: string; questions: string }> = {
  HEAD_NECK: {
    label: 'Głowa / Szyja',
    questions: 'Ocena skóry, kości, asymetria, stabilność szyi',
  },
  CHEST: {
    label: 'Klatka Piersiowa',
    questions: 'Stabilność, symetria oddechu, rany, tkliwość, duszność',
  },
  ABDOMEN: {
    label: 'Brzuch',
    questions: 'Napięcie, tkliwość, obecność ran, wzdęcia',
  },
  PELVIS: {
    label: 'Miednica',
    questions: 'Stabilność miednicy (tylko w razie podejrzenia urazu)',
  },
  UPPER_LIMBS: {
    label: 'Kończyny Górne',
    questions: 'Ocena ruchomości, tętna, czucia, siły, złamania',
  },
  LOWER_LIMBS: {
    label: 'Kończyny Dolne',
    questions: 'Ocena ruchomości, tętna, czucia, siły, złamania',
  },
  BACK: {
    label: 'Plecy',
    questions: 'Ocena skóry i kręgosłupa (wyłącznie przy zabezpieczeniu)',
  },
};

// ============================================================================
// V. SAMPLE (Historia Medyczna)
// ============================================================================

export interface SAMPLEAssessment {
  S_symptoms: string; // Objawy
  A_allergies: string; // Alergie
  M_medications: string; // Leki
  P_pastMedicalHistory: string; // Przeszłość medyczna
  L_lastOralIntake: string; // Ostatni posiłek
  E_events: string; // Wydarzenia prowadzące do urazu
}

// ============================================================================
// VI. GŁÓWNA STRUKTURA OCENY POSZKODOWANEGO
// ============================================================================

export interface VictimAssessment {
  id: string;
  actionId: string; // ID akcji
  createdAt: Date;
  updatedAt: Date;
  
  // Krok 1: Grupa wiekowa
  ageGroup: AgeGroup | null;
  
  // Krok 2: ACVPU
  acvpu: ACVPULevel | null;
  
  // Krok 3: ABC (jeśli wymagane)
  airway: AirwayAssessment | null;
  breathing: BreathingAssessment | null;
  circulation: CirculationAssessment | null;
  
  // Krok 4: Badanie Urazowe (jeśli ACVPU = A lub C)
  injuryAssessment: Record<BodyArea, BodyAreaAssessment> | null;
  
  // Krok 5: SAMPLE
  sample: SAMPLEAssessment | null;
  
  // Status całości
  overallStatus: 'GREEN' | 'YELLOW' | 'RED' | null;
  criticalAlerts: string[]; // Lista krytycznych alertów
}

// ============================================================================
// VII. FUNKCJE POMOCNICZE
// ============================================================================

export function getACVPUOption(level: ACVPULevel): ACVPUOption {
  return ACVPU_OPTIONS.find((opt) => opt.level === level)!;
}

export function determineBreathingStatus(rate: number): {
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
  severity: 'GREEN' | 'YELLOW' | 'RED';
  alert?: string;
} {
  if (rate === 0) {
    return {
      status: 'CRITICAL',
      severity: 'RED',
      alert: BREATHING_RANGES.CRITICAL.alert,
    };
  }
  if (rate >= 10 && rate <= 20) {
    return { status: 'NORMAL', severity: 'GREEN' };
  }
  return {
    status: 'ABNORMAL',
    severity: 'YELLOW',
    alert: BREATHING_RANGES.ABNORMAL.alert,
  };
}

export function createEmptyVictimAssessment(actionId: string): VictimAssessment {
  return {
    id: crypto.randomUUID(),
    actionId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ageGroup: null,
    acvpu: null,
    airway: {
      step1_foreignBodies: null,
      step2_technique: null,
      step2_injury_result: null,
      status: null,
    },
    breathing: {
      respiratoryRate: null,
      status: null,
    },
    circulation: {
      bleeding: null,
      pulseRate: null,
      pulseQuality: null,
      shockSigns: null,
      status: null,
    },
    injuryAssessment: null,
    sample: {
      S_symptoms: '',
      A_allergies: '',
      M_medications: '',
      P_pastMedicalHistory: '',
      L_lastOralIntake: '',
      E_events: '',
    },
    overallStatus: null,
    criticalAlerts: [],
  };
}

