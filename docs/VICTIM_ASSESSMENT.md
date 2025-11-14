# 🚑 Moduł Poszkodowani - Pierwsza Pomoc

## Przegląd

Moduł **Poszkodowani** to zaawansowany system oceny stanu poszkodowanego zgodny z protokołami pierwszej pomocy. Implementuje pełny algorytm ACVPU + ABC + Badanie Urazowe + SAMPLE.

## Specyfikacja

### I. Struktura i Podział Wiekowy

Zakładka główna **POSZKODOWANI** → Wymuś wybór grupy wiekowej:

1. **DOROŚLI**
2. **DZIECI**
3. **NIEMOWLĘTA**
4. **PRZYPADKI SPECJALNE**

### II. Algorytm Oceny Stanu Świadomości (ACVPU)

Użytkownik wybiera stan poszkodowanego:

| Skala (ACVPU) | Reakcja Poszkodowanego | Logika / Następny Krok |
|---------------|------------------------|------------------------|
| **A** | Alert (Przytomny, reaguje, zorientowany) | → Przejdź do: Badanie Urazowe i Wywiad SAMPLE |
| **C** | Confusion (Zdezorientowany, senny, splątany) | → Przejdź do: Badanie Urazowe i Wywiad SAMPLE |
| **V** | Voice (Reaguje tylko na GŁOS) | → Przejdź do: Badanie ABC (stan ciężki) |
| **P** | Pain (Reaguje tylko na BÓL) | → Przejdź do: Badanie ABC (nieprzytomny) |
| **U** | Unresponsive (Nie reaguje na głos ani ból) | → Przejdź natychmiast do: Badanie ABC (A/B). **PODEJRZEWAJ NZK!** |

### III. Algorytm Oceny Urazowej i Stanu Nagłe (ABC)

#### 1. A – Airway (Drogi Oddechowe)

**KROK 1: KONTROLA I USUNIĘCIE CIAŁ OBCYCH**

- **Pytanie:** Czy w ustach widoczne są ciała obce, treść pokarmowa lub płyny? (Wybór: TAK / NIE)
- **Logika:** Jeśli TAK → **CZERWONY!** 🔴 Komunikat: **USUŃ widoczne ciało obce/płyny.**

**KROK 2: WYBÓR TECHNIKI UDRAŻNIANIA**

- **Pytanie A (Uraz):** Czy występuje podejrzenie urazu kręgosłupa szyjnego? (Wybór: TAK / NIE)
  - Uraz NIE → **CZERWONY!** 🔴 Komunikat: **UDROŻNIJ RĘKOCZYNEM CZOŁO-ŻUCHWA.**
  - Uraz TAK → **CZERWONY!** 🔴 Komunikat: **UDROŻNIJ RĘKOCZYNEM UNIESIENIA ŻUCHWY** (bez odgięcia głowy).

- **Pytanie B (Drożność):** Czy drogi oddechowe są drożne po kontroli? (Wybór: TAK / NIE / Ryzyko niedrożności)
  - Uraz NIE → **CZERWONY!** 🔴 Komunikat: **UDROŻNIJ RĘKOCZYNEM CZOŁO-ŻUCHWA.**
  - Uraz TAK → **ZIELONY!** ✅ Komunikat: Drogi oddechowe drożne. Przejdź do Breathing.

#### 2. B – Breathing (Oddychanie)

- **Pytanie:** Wprowadź Liczbę Oddechów na Minutę (L/min): [Pole do wpisania liczby]

**Logika (Dorośli jako przykład):**

- **10–20 L/min** → **ZIELONY** ✅
- **< 10 L/min lub > 20 L/min** → **POMARAŃCZOWY** ⚠️ Komunikat: Kontynuuj kontrolę.
- **0 L/min lub oddech agonalny** → **CZERWONY!** 🔴 Komunikat: **NATYCHMIAST ROZPOCZNIJ RKO!** → Przejdź do sekcji RKO.

#### 3. C – Circulation (Krążenie)

**Pytanie A: Krwawienie**
- Krwawienia (Wybór: BRAK / ŻYLNE / TĘTNICZE)

**Logika:**
- Jeśli **Krwawienie TĘTNICZE** → **CZERWONY!** 🔴 Komunikat: **TAMUJ KRWOTOK SILNYM, BEZPOŚREDNIM UCIŚKIEM.**
- Jeśli **Tętno NIEOBECNE** → **CZERWONY!** 🔴 Komunikat: **NATYCHMIAST ROZPOCZNIJ RKO!**
- Jeśli **Tętno NITKOWATE** lub Objawy wstrząsu → **POMARAŃCZOWY** ⚠️ Komunikat: Pozycja przeciwwstrząsowa (o ile nie ma urazu), zabezpieczenie termiczne.

**Pytanie B: Tętno**
- Wprowadź Wartość tętna (uderzenia/min): [Pole do wpisania liczby]

**Pytanie C: Jakość tętna**
- Wybierz (Wybór: PRAWIDŁE / SZYBKIE / WOLNE / NITKOWATE / NIEOBECNE)

**Pytanie D: Objawy wstrząsu**
- Objawy wstrząsu (Wybór: TAK / NIE)

### IV. Badanie Urazowe (Ocena Urazowa "Head-to-Toe")

Ta sekcja powinna być dostępna w przypadku poszkodowanego nieprzytomnego lub po stabilizacji ABC. Umożliwia szczegółową ocenę z możliwością odnotowania nieprawidłowości (Deformacje, Otarcia, Rany, Tkliwość, Obrzęki).

| Obszar Ciała | Pytanie | Pole do Wprowadzenia Notatek / Checkbox |
|--------------|---------|----------------------------------------|
| **Głowa / Szyja** | Ocena skóry, kości, asymetria, stabilność szyi | [Pole tekstowe / TAK/NIE] |
| **Klatka Piersiowa** | Stabilność, symetria oddechu, rany, tkliwość, duszność | [Pole tekstowe / TAK/NIE] |
| **Brzuch** | Napięcie, tkliwość, obecność ran, wzdęcia | [Pole tekstowe / TAK/NIE] |
| **Miednica** | Stabilność miednicy (tylko w razie podejrzenia urazu) | [Pole tekstowe / TAK/NIE] |
| **Kończyny Górne** | Ocena ruchomości, tętna, czucia, siły, złamania | [Pole tekstowe / TAK/NIE] |
| **Kończyny Dolne** | Ocena ruchomości, tętna, czucia, siły, złamania | [Pole tekstowe / TAK/NIE] |
| **Plecy** | Ocena skóry i kręgosłupa (wyłącznie przy zabezpieczeniu) | [Pole tekstowe / TAK/NIE] |

### V. SAMPLE (Historia Medyczna)

- **S** – Symptoms (Objawy): [Pole tekstowe]
- **A** – Allergies (Alergie): [Pole tekstowe]
- **M** – Medications (Leki): [Pole tekstowe]
- **P** – Past Medical History (Przeszłość Medyczna): [Pole tekstowe]
- **L** – Last Oral Intake (Ostatni Posiłek): [Pole tekstowe]
- **E** – Events (Wydarzenia Prowadzące do Urazu): [Pole tekstowe]

## Architektura

### Struktura plików

```
osp-commander/
├── types/
│   └── victim.ts                    # Typy danych
├── components/
│   └── actions/
│       ├── victim-assessment.tsx    # Główny komponent
│       └── victim-steps/
│           ├── airway-step.tsx      # Krok A - Drogi oddechowe
│           ├── breathing-step.tsx   # Krok B - Oddychanie
│           ├── circulation-step.tsx # Krok C - Krążenie
│           ├── injury-assessment-step.tsx # Badanie urazowe
│           └── sample-step.tsx      # Historia medyczna
└── components/incident/
    └── casualties-list.tsx          # Lista poszkodowanych z integracją
```

### Typy danych

```typescript
// Główna struktura oceny
interface VictimAssessment {
  id: string;
  actionId: string;
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
  
  // Krok 4: Badanie Urazowe
  injuryAssessment: Record<BodyArea, BodyAreaAssessment> | null;
  
  // Krok 5: SAMPLE
  sample: SAMPLEAssessment | null;
  
  // Status całości
  overallStatus: 'GREEN' | 'YELLOW' | 'RED' | null;
  criticalAlerts: string[];
}
```

## Użycie

### 1. Dodawanie poszkodowanego

1. Przejdź do zakładki **Poszkodowani**
2. Kliknij **"Dodaj poszkodowanego"**
3. Wypełnij podstawowe dane (imię, wiek, stan)

### 2. Ocena pierwszej pomocy

1. Przy poszkodowanym kliknij ikonę **🩺 Stethoscope**
2. Otworzy się dialog z pełnym algorytmem oceny
3. Przejdź przez kroki:
   - Wybór grupy wiekowej
   - Ocena ACVPU
   - ABC (jeśli wymagane)
   - Badanie urazowe (jeśli przytomny)
   - SAMPLE

### 3. Interpretacja alertów

- **🔴 CZERWONY!** - Stan krytyczny, natychmiastowe działanie
- **⚠️ POMARAŃCZOWY** - Stan wymagający uwagi
- **✅ ZIELONY** - Stan stabilny

## Logika warunkowa

### Przejścia między krokami

```
ACVPU = A lub C
  → Badanie Urazowe → SAMPLE

ACVPU = V
  → ABC (stan ciężki) → Badanie Urazowe → SAMPLE

ACVPU = P
  → ABC (nieprzytomny) → Badanie Urazowe → SAMPLE

ACVPU = U
  → ABC (A/B) → NATYCHMIAST! (podejrzenie NZK)
```

### Czerwone alerty (STOP)

Następujące sytuacje zatrzymują dalszy proces i wymagają natychmiastowego działania:

1. **Oddech = 0 L/min** → RKO
2. **Tętno NIEOBECNE** → RKO
3. **Krwawienie TĘTNICZE** → Tamowanie krwotoku
4. **Drogi oddechowe niedrożne** → Udrożnienie

## Przykłady użycia

### Przykład 1: Poszkodowany przytomny (ACVPU = A)

```
1. Grupa wiekowa: DOROŚLI
2. ACVPU: A (Alert)
   → Przejdź do Badania Urazowego
3. Badanie Urazowe:
   - Głowa: Brak obrażeń
   - Klatka: Tkliwość po lewej stronie
   - Brzuch: Miękki, niebolesny
   ...
4. SAMPLE:
   - S: Ból w klatce piersiowej
   - A: Brak alergii
   - M: Aspiryna
   ...
```

### Przykład 2: Poszkodowany nieprzytomny (ACVPU = U)

```
1. Grupa wiekowa: DOROŚLI
2. ACVPU: U (Unresponsive)
   🔴 CZERWONY! PODEJRZEWAJ NZK!
   → Przejdź do ABC
3. A - Airway:
   - Ciała obce: NIE
   - Uraz kręgosłupa: TAK
   🔴 CZERWONY! Udrożnij rękoczynem uniesienia żuchwy
4. B - Breathing:
   - Oddech: 0 L/min
   🔴 CZERWONY! NATYCHMIAST ROZPOCZNIJ RKO!
   → STOP - przejdź do RKO
```

## Integracja z systemem

Moduł jest zintegrowany z:

- **Lista poszkodowanych** - przycisk oceny przy każdym poszkodowanym
- **System alertów** - krytyczne alerty są zapisywane
- **Historia akcji** - wszystkie oceny są archiwizowane

## Rozwój

### Planowane funkcje

- [ ] Eksport oceny do PDF
- [ ] Integracja z systemem powiadomień
- [ ] Automatyczne sugestie działań
- [ ] Wsparcie dla wielu ratowników
- [ ] Synchronizacja z systemem medycznym

## Licencja

MIT License - zgodnie z głównym projektem OSP Commander

