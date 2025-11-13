# 📋 Plan wyposażenia pojazdu - Dokumentacja

## 🎯 Cel

**Plan wyposażenia pojazdu** to dedykowany widok, który wyświetla **wszystkie elementy wyposażenia na jednym ekranie** w formie dużego planu z góry. Idealny do:

- 🚒 **Szybkiego przeglądu** przed wyjazdem do akcji
- 📖 **Przypomnienia sobie** co gdzie jest
- 🖨️ **Wydruku** i umieszczenia w remizie
- 📱 **Mobilnego dostępu** na tablecie w pojeździe
- 👥 **Szkolenia** nowych członków OSP

---

## 🌟 Kluczowe cechy

### ✅ Wszystko na jednym ekranie
- **Brak klikania** - wszystkie elementy widoczne od razu
- **Duży plan** - 1200x800px (skalowany)
- **Kafelki z wyposażeniem** - bezpośrednio na schowkach
- **Maksymalna czytelność** - duże czcionki, kontrastowe kolory

### ✅ Profesjonalny wygląd
- **Kolorowe schowki** - łatwa identyfikacja
- **Grupowanie według kategorii** - opcjonalne
- **Legenda pojazdu** - dane techniczne
- **Statystyki** - podsumowanie wyposażenia

### ✅ Funkcje użytkowe
- **Zoom** - 50% do 200%
- **Siatka pomocnicza** - włącz/wyłącz
- **Widok kategorii** - grupuj lub lista
- **Drukowanie** - format A3 landscape
- **Eksport PDF** - w przygotowaniu

---

## 📁 Struktura plików

```
osp-commander/
├── components/
│   └── vehicle-equipment-plan-view.tsx    # Główny komponent widoku
└── app/
    └── vehicle-plan/
        └── page.tsx                        # Strona planu wyposażenia
```

---

## 🎨 Komponent: VehicleEquipmentPlanView

### Użycie

```tsx
import { VehicleEquipmentPlanView } from '@/components/vehicle-equipment-plan-view';

<VehicleEquipmentPlanView vehicle={currentVehicle} />
```

### Props

| Prop | Typ | Wymagany | Opis |
|------|-----|----------|------|
| `vehicle` | `VehicleConfiguration` | ✅ | Konfiguracja pojazdu do wyświetlenia |

### Funkcje

#### 1. **Zoom**
- Zakres: 50% - 200%
- Przyciski: `-` / `+` / Reset (100%)
- Skrót: Scroll + Ctrl (planowane)

#### 2. **Siatka pomocnicza**
- Linie co 10% (pionowe i poziome)
- Kolor: niebieski, przezroczysty
- Przełącznik: przycisk "Pokaż/Ukryj siatkę"

#### 3. **Widok kategorii**
- **Z kategoriami**: Wyposażenie grupowane według typu (węże, prądownice, itp.)
- **Bez kategorii**: Lista kompaktowa, wszystko pod sobą
- Przełącznik: przycisk "Kategorie"

#### 4. **Kafelki wyposażenia**
- Białe tło z cieniem
- Nazwa elementu (bold)
- Ilość + jednostka (badge)
- Opis (opcjonalny, mniejsza czcionka)
- Hover: powiększony cień

---

## 🖥️ Strona: /vehicle-plan

### Funkcje strony

#### **Nagłówek**
- Tytuł: "Plan wyposażenia pojazdu"
- Opis: "Wszystkie elementy wyposażenia widoczne na jednym ekranie"
- Przycisk "Powrót" → `/vehicle-equipment`

#### **Toolbar**
- **Wybór pojazdu** - dropdown (jeśli więcej niż 1)
- **Eksport PDF** - w przygotowaniu
- **Drukuj** - otwiera dialog drukowania

#### **Główny widok**
- Komponent `VehicleEquipmentPlanView`
- Tło: gradient slate
- Centrowanie: auto margins

#### **Legenda kolorów**
- 🔴 Czerwony - Schowki przednie
- 🟢 Zielony - Schowki tylne
- 🔵 Niebieski - Kabina
- 🟠 Pomarańczowy - Pompa

---

## 🎨 Układ wizualny

### Schemat planu

```
┌─────────────────────────────────────────────────────────┐
│  [Legenda pojazdu]                                      │
│  GBA 2/16                                               │
│  💧 Zbiornik: 2400L                                     │
│  ⚙️ Pompa: TS 8/8                                       │
│  👥 Załoga: 6 osób                                      │
│                                                         │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │ Schowek 1    │         │ Schowek 2    │             │
│  │ Lewy przedni │         │ Prawy przedni│             │
│  ├──────────────┤         ├──────────────┤             │
│  │ • Wąż W75    │         │ • Prądownica │             │
│  │   [2 szt]    │         │   [3 szt]    │             │
│  │ • Wąż W52    │         │ • Drabina    │             │
│  │   [3 szt]    │         │   [1 szt]    │             │
│  └──────────────┘         └──────────────┘             │
│                                                         │
│         ┌────────────────────┐                          │
│         │     KABINA         │                          │
│         │  [Środki łączności]│                          │
│         └────────────────────┘                          │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │ Schowek 3    │         │ Schowek 4    │             │
│  │ Lewy tylny   │         │ Prawy tylny  │             │
│  ├──────────────┤         ├──────────────┤             │
│  │ • Agregat    │         │ • Piła       │             │
│  │   [1 szt]    │         │   [1 szt]    │             │
│  └──────────────┘         └──────────────┘             │
│                                                         │
│                                    [Statystyki]         │
│                                    Schowki: 6           │
│                                    Elementy: 42         │
│                                    Łącznie: 156 szt     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Przypadki użycia

### 1. **Przed wyjazdem do akcji**

**Scenariusz:** Strażak chce szybko sprawdzić co jest w aucie przed wyjazdem.

**Kroki:**
1. Otwórz `/vehicle-plan` na tablecie
2. Jeden rzut oka - wszystko widoczne
3. Sprawdź czy potrzebny sprzęt jest na pokładzie
4. Wyjazd!

**Korzyści:**
- ⏱️ Oszczędność czasu (brak klikania)
- 🎯 Pewność że nic nie zostało zapomniane
- 📱 Mobilny dostęp

---

### 2. **Szkolenie nowych członków**

**Scenariusz:** Nowy strażak uczy się rozmieszczenia sprzętu.

**Kroki:**
1. Wydrukuj plan (A3 landscape)
2. Umieść w remizie przy pojeździe
3. Nowy członek porównuje plan z rzeczywistością
4. Zapamiętuje lokalizacje

**Korzyści:**
- 📖 Wizualna pomoc dydaktyczna
- 🖨️ Łatwy dostęp (wydruk)
- 🎓 Szybsza nauka

---

### 3. **Inwentaryzacja**

**Scenariusz:** Kontrola wyposażenia po akcji.

**Kroki:**
1. Otwórz plan na tablecie
2. Przejdź przez każdy schowek
3. Zaznacz co zostało użyte
4. Uzupełnij braki

**Korzyści:**
- ✅ Systematyczna kontrola
- 📋 Nic nie zostanie pominięte
- 📊 Łatwe raportowanie

---

## 🖨️ Drukowanie

### Ustawienia druku

**Format:** A3 landscape (poziomo)  
**Marginesy:** 1cm  
**Kolory:** Pełne (nie czarno-białe)  
**Skala:** Dopasuj do strony

### Przygotowanie do druku

1. Kliknij przycisk **"Drukuj"**
2. Wybierz drukarkę
3. Ustaw orientację: **Landscape (poziomo)**
4. Ustaw rozmiar: **A3**
5. Drukuj!

### Co jest ukryte przy druku?

- ❌ Nagłówek strony
- ❌ Toolbar (zoom, siatka, itp.)
- ❌ Przyciski
- ✅ Tylko plan wyposażenia

---

## 🎨 Personalizacja

### Zmiana kolorów schowków

W edytorze pozycji (`/vehicle-equipment` → zakładka "Pozycje"):

```typescript
// Sugerowane kolory
const COLORS = {
  FRONT: '#ef4444',      // Czerwony - schowki przednie
  REAR: '#10b981',       // Zielony - schowki tylne
  CABIN: '#3b82f6',      // Niebieski - kabina
  PUMP: '#f97316',       // Pomarańczowy - pompa
  SPECIAL: '#8b5cf6',    // Fioletowy - specjalne
};
```

### Zmiana rozmiaru schowków

W edytorze pozycji:
- Przeciągnij schowek
- Zmień szerokość/wysokość (5-50%)
- Zapisz automatycznie

### Dodanie nowych elementów

W module wyposażenia (`/vehicle-equipment` → zakładka "Zarządzanie"):
1. Wybierz schowek
2. Kliknij "Dodaj element"
3. Wypełnij formularz
4. Zapisz

---

## 📊 Statystyki

### Wyświetlane dane

**Legenda pojazdu:**
- 💧 Zbiornik wody (L)
- 🧴 Zbiornik piany (L)
- ⚙️ Typ pompy
- 👥 Liczba załogi

**Podsumowanie:**
- Liczba schowków
- Liczba elementów wyposażenia
- Łączna ilość sztuk

---

## 🚀 Roadmap (przyszłe funkcje)

### Planowane funkcje

- [ ] **Eksport do PDF** - generowanie PDF z planem
- [ ] **Tryb nocny** - ciemny motyw dla lepszej widoczności
- [ ] **Wyszukiwanie** - znajdź element na planie
- [ ] **Podświetlenie** - zaznacz wybrany element
- [ ] **Statusy** - dostępne/w użyciu/uszkodzone
- [ ] **Historia użycia** - co było używane podczas akcji
- [ ] **Porównanie** - przed/po akcji
- [ ] **Zdjęcia sprzętu** - miniaturki w kafelkach
- [ ] **QR kody** - skanowanie sprzętu
- [ ] **Offline mode** - PWA z cache

---

## 🐛 Troubleshooting

### Problem: Plan jest za mały

**Rozwiązanie:** Użyj przycisku **Zoom +** lub ustaw większy zoom (np. 150%)

### Problem: Kafelki nachodzą na siebie

**Rozwiązanie:** 
1. Przejdź do `/vehicle-equipment` → zakładka "Pozycje"
2. Zmniejsz rozmiar schowków
3. Przesuń schowki dalej od siebie

### Problem: Tekst jest nieczytelny

**Rozwiązanie:**
1. Zwiększ rozmiar schowków (min. 20% szerokości)
2. Zmniejsz ilość elementów w schowku
3. Wyłącz widok kategorii (kompaktowy)

### Problem: Nie drukuje się poprawnie

**Rozwiązanie:**
1. Sprawdź orientację: **Landscape**
2. Sprawdź rozmiar: **A3**
3. Wyłącz "Dopasuj do strony" jeśli tekst jest za mały
4. Użyj "Drukuj do PDF" jako test

---

## 💡 Najlepsze praktyki

### ✅ DO:
- Używaj kontrastowych kolorów dla schowków
- Grupuj podobne elementy w jednym schowku
- Dodawaj opisy do nietypowego sprzętu
- Regularnie aktualizuj plan po zmianach
- Drukuj i umieszczaj w remizie
- Testuj na różnych urządzeniach

### ❌ DON'T:
- Nie umieszczaj zbyt wielu elementów w jednym schowku (max 15)
- Nie używaj podobnych kolorów dla sąsiednich schowków
- Nie pomijaj jednostek (szt, m, kg)
- Nie drukuj w czarno-białym (kolory są ważne)
- Nie zapomnij o aktualizacji po zmianach

---

## 📞 Wsparcie

Jeśli masz pytania lub sugestie dotyczące planu wyposażenia:

1. Sprawdź dokumentację: `docs/VEHICLE_EQUIPMENT.md`
2. Zobacz przykłady w kodzie: `data/vehicle-configurations.ts`
3. Testuj na danych demo (GBA 2/16)

---

## 📄 Licencja

© 2025 OSP Commander - Zbudowane z ❤️ dla polskich strażaków

---

**Ostatnia aktualizacja:** 2025-01-12  
**Wersja:** 1.0.0  
**Status:** ✅ Gotowe do użycia

