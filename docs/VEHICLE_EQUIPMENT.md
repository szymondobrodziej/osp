# 🚒 Moduł Wyposażenia Pojazdu

## Opis

Moduł wyposażenia pojazdu pozwala na przeglądanie, zarządzanie i edycję wyposażenia pojazdów ratowniczych OSP. System umożliwia:

- **Wizualizację pojazdu** - widok z góry z rzeczywistymi zdjęciami
- **Organizację wyposażenia** - podział na schowki z kolorowym kodowaniem
- **Zarządzanie bazą danych** - dodawanie, edycja i usuwanie elementów
- **Szybki podgląd** - wszystkie informacje widoczne na jednym ekranie
- **Statystyki** - analiza wyposażenia według kategorii

## Struktura plików

```
osp-commander/
├── types/
│   └── vehicle-equipment.ts          # Definicje typów TypeScript
├── data/
│   └── vehicle-configurations.ts     # Domyślne konfiguracje pojazdów
├── store/
│   └── vehicle-equipment-store.ts    # Zustand store z persystencją
├── components/
│   ├── vehicle-equipment-viewer.tsx  # Komponent podglądu
│   └── vehicle-equipment-editor.tsx  # Komponent edycji
├── app/
│   └── vehicle-equipment/
│       └── page.tsx                  # Główna strona modułu
└── public/
    └── vehicles/
        ├── gba-view-1.jpg           # Zdjęcie pojazdu - widok 1
        └── gba-view-2.jpg           # Zdjęcie pojazdu - widok 2
```

## Typy danych

### EquipmentCategory

13 kategorii wyposażenia:

- `HOSES` - Węże
- `NOZZLES` - Prądownice
- `LADDERS` - Drabiny
- `RESCUE` - Sprzęt ratowniczy
- `MEDICAL` - Sprzęt medyczny
- `TOOLS` - Narzędzia
- `BREATHING` - Sprzęt oddechowy
- `LIGHTING` - Oświetlenie
- `PUMPS` - Pompy
- `COMMUNICATION` - Łączność
- `PPE` - Środki ochrony osobistej
- `EXTINGUISHING` - Sprzęt gaśniczy
- `OTHER` - Inne

### EquipmentItem

```typescript
interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  unit?: string;
  description?: string;
  location: string; // ID schowka
  icon?: string;
  image?: string;
  notes?: string;
}
```

### VehicleCompartment

```typescript
interface VehicleCompartment {
  id: string;
  name: string;
  position: { x: number; y: number }; // % pozycjonowanie
  size: { width: number; height: number }; // % rozmiar
  color?: string;
  items: EquipmentItem[];
  description?: string;
}
```

### VehicleConfiguration

```typescript
interface VehicleConfiguration {
  id: string;
  name: string;
  type: VehicleType;
  registrationNumber?: string;
  compartments: VehicleCompartment[];
  views: VehicleView[];
  specifications?: {
    waterTank?: number;
    foamTank?: number;
    pump?: string;
    crew?: number;
    manufacturer?: string;
    model?: string;
    year?: number;
  };
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
  };
}
```

## Funkcjonalności

### 1. Podgląd wyposażenia

**Komponent:** `VehicleEquipmentViewer`

**Funkcje:**
- Wyświetlanie zdjęć pojazdu z góry
- Nawigacja między różnymi widokami
- Lista schowków z kolorowym kodowaniem
- Szczegóły wyposażenia w modalach
- Wyszukiwanie elementów
- Widok listy vs. widok wizualny

**Użycie:**
```tsx
import { VehicleEquipmentViewer } from '@/components/vehicle-equipment-viewer';

<VehicleEquipmentViewer 
  vehicle={currentVehicle} 
  editable={true}
  onEditMode={() => setEditMode(true)}
/>
```

### 2. Edycja wyposażenia

**Komponent:** `VehicleEquipmentEditor`

**Funkcje:**
- Dodawanie nowych elementów wyposażenia
- Edycja istniejących elementów
- Usuwanie elementów
- Zarządzanie schowkami
- Dodawanie nowych schowków
- Usuwanie schowków

**Użycie:**
```tsx
import { VehicleEquipmentEditor } from '@/components/vehicle-equipment-editor';

<VehicleEquipmentEditor vehicle={currentVehicle} />
```

### 3. Store (Zustand)

**Store:** `useVehicleEquipmentStore`

**Akcje:**

```typescript
// Zarządzanie pojazdami
loadDefaultVehicles()
setCurrentVehicle(vehicleId)
getCurrentVehicle()
addVehicle(vehicle)
updateVehicle(vehicleId, updates)
deleteVehicle(vehicleId)

// Zarządzanie wyposażeniem
addEquipmentItem(vehicleId, compartmentId, item)
updateEquipmentItem(vehicleId, compartmentId, itemId, updates)
deleteEquipmentItem(vehicleId, compartmentId, itemId)
moveEquipmentItem(vehicleId, itemId, fromCompartmentId, toCompartmentId)

// Zarządzanie schowkami
addCompartment(vehicleId, compartment)
updateCompartment(vehicleId, compartmentId, updates)
deleteCompartment(vehicleId, compartmentId)

// Pomocnicze
getEquipmentStats(vehicleId)
searchEquipment(vehicleId, query)
getCompartmentById(vehicleId, compartmentId)
```

**Przykład użycia:**

```typescript
const { 
  vehicles, 
  currentVehicleId, 
  getCurrentVehicle,
  addEquipmentItem 
} = useVehicleEquipmentStore();

const currentVehicle = getCurrentVehicle();

// Dodaj nowy element
addEquipmentItem(currentVehicle.id, 'comp-left-front', {
  name: 'Wąż W75',
  category: 'HOSES',
  quantity: 3,
  unit: 'szt',
  description: '15m każdy',
  location: 'comp-left-front',
});
```

## Dodawanie nowego pojazdu

### 1. Przygotuj zdjęcia

Umieść zdjęcia pojazdu w `public/vehicles/`:
- Format: JPG, PNG
- Nazwa: `{vehicle-id}-view-{number}.jpg`
- Przykład: `gba-view-1.jpg`, `gba-view-2.jpg`

### 2. Utwórz konfigurację

W pliku `data/vehicle-configurations.ts`:

```typescript
export const NOWY_POJAZD: VehicleConfiguration = {
  id: 'nowy-pojazd',
  name: 'GBA 2/16',
  type: 'GBA',
  registrationNumber: 'ABC 1234',
  views: [
    {
      id: 'view-1',
      name: 'Widok główny',
      imageUrl: '/vehicles/nowy-pojazd-view-1.jpg',
      description: 'Widok z góry',
    },
  ],
  specifications: {
    waterTank: 2400,
    pump: 'TS 8/8',
    crew: 6,
  },
  compartments: [
    {
      id: 'comp-1',
      name: 'Schowek 1',
      position: { x: 10, y: 20 },
      size: { width: 20, height: 15 },
      color: '#ef4444',
      items: [
        {
          id: 'item-1',
          name: 'Wąż W75',
          category: 'HOSES',
          quantity: 3,
          unit: 'szt',
          location: 'comp-1',
        },
      ],
    },
  ],
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Dodaj do eksportu
export const VEHICLE_CONFIGURATIONS: VehicleConfiguration[] = [
  GBA_DEFAULT,
  NOWY_POJAZD, // <-- dodaj tutaj
];
```

### 3. Pozycjonowanie schowków

Pozycje i rozmiary schowków są w procentach (0-100):

```typescript
position: { x: 10, y: 20 }  // 10% od lewej, 20% od góry
size: { width: 20, height: 15 }  // 20% szerokości, 15% wysokości
```

## Persystencja danych

Dane są automatycznie zapisywane w `localStorage` pod kluczem:
```
osp-vehicle-equipment-storage
```

Struktura zapisanych danych:
```json
{
  "state": {
    "vehicles": [...],
    "currentVehicleId": "gba-default"
  },
  "version": 0
}
```

## Statystyki

Moduł automatycznie generuje statystyki:

```typescript
interface EquipmentStats {
  totalItems: number;
  itemsByCategory: Record<EquipmentCategory, number>;
  compartmentCount: number;
}
```

Użycie:
```typescript
const stats = getEquipmentStats(vehicleId);
console.log(`Łącznie elementów: ${stats.totalItems}`);
console.log(`Węży: ${stats.itemsByCategory.HOSES}`);
```

## Integracja z akcjami (przyszłość)

Planowane funkcje:
- Śledzenie użytego wyposażenia podczas akcji
- Status wyposażenia (dostępne/w użyciu/uszkodzone)
- Historia użycia
- Raporty z akcji

## Przykładowe dane

Domyślna konfiguracja GBA 2/16 zawiera:
- **6 schowków** (kabina, 2x przednie, 3x tylne)
- **~40 elementów wyposażenia**
- **13 kategorii** sprzętu

Kategorie z największą liczbą elementów:
1. Węże i prądownice (HOSES, NOZZLES)
2. Narzędzia (TOOLS)
3. Oświetlenie (LIGHTING)
4. Sprzęt ratowniczy (RESCUE, BREATHING)

## Wskazówki

### Kolory schowków

Sugerowane kolory dla różnych sekcji:
- 🔴 Czerwony (`#ef4444`) - przednie schowki
- 🟢 Zielony (`#10b981`) - tylne schowki
- 🔵 Niebieski (`#3b82f6`) - kabina
- 🟠 Pomarańczowy (`#f97316`) - pompa/agregat

### Organizacja wyposażenia

Zalecenia:
- Grupuj podobne elementy w jednym schowku
- Używaj opisów dla elementów wymagających szczegółów
- Aktualizuj ilości po każdej zmianie
- Regularnie przeglądaj i aktualizuj bazę

### Wydajność

- Zdjęcia pojazdów są ładowane z optymalizacją Next.js Image
- Store używa persystencji z debounce
- Komponenty używają React.memo gdzie to możliwe

## Troubleshooting

### Zdjęcia się nie ładują

Sprawdź:
1. Czy pliki są w `public/vehicles/`
2. Czy ścieżka w `imageUrl` zaczyna się od `/vehicles/`
3. Czy format pliku jest obsługiwany (JPG, PNG)

### Dane się nie zapisują

Sprawdź:
1. Czy localStorage jest dostępny w przeglądarce
2. Czy nie ma błędów w konsoli
3. Czy store jest poprawnie zainicjalizowany

### Schowki się nakładają

Dostosuj pozycje i rozmiary:
```typescript
position: { x: 10, y: 20 }  // Zmień wartości
size: { width: 15, height: 10 }  // Zmniejsz rozmiar
```

## Edytor pozycji schowków

### Interaktywne przeciąganie

**Komponent:** `VehicleCompartmentPositionEditor`

**Funkcje:**
- ✅ Przeciąganie schowków myszką bezpośrednio na zdjęciu
- ✅ Zmiana rozmiaru schowków (szerokość/wysokość)
- ✅ Zmiana koloru schowków
- ✅ Precyzyjne ustawienie pozycji (współrzędne X/Y w %)
- ✅ Siatka pomocnicza (włącz/wyłącz)
- ✅ Zoom (50%-200%)
- ✅ Reset pozycji do domyślnych
- ✅ Panel właściwości wybranego schowka
- ✅ Podgląd zawartości schowka

**Użycie:**
```tsx
import { VehicleCompartmentPositionEditor } from '@/components/vehicle-compartment-position-editor';

<VehicleCompartmentPositionEditor
  vehicle={currentVehicle}
  viewIndex={0}
/>
```

**Jak używać:**
1. Przejdź do zakładki **"Pozycje"** w module wyposażenia
2. Kliknij na schowek aby go wybrać
3. Przeciągnij schowek w nowe miejsce
4. Dostosuj rozmiar i kolor w panelu właściwości
5. Zmiany są zapisywane automatycznie

**Pozycjonowanie:**
- Pozycje są w procentach (0-100%) względem rozmiaru obrazu
- `position.x` - odległość od lewej krawędzi (%)
- `position.y` - odległość od górnej krawędzi (%)
- `size.width` - szerokość schowka (%)
- `size.height` - wysokość schowka (%)

**Przykład:**
```typescript
{
  position: { x: 25, y: 30 },  // 25% od lewej, 30% od góry
  size: { width: 20, height: 15 }  // 20% szerokości, 15% wysokości
}
```

---

## Generator rzutu z góry

### SVG Generator

**Komponent:** `VehicleSVGGenerator`

**Funkcje:**
- ✅ Generowanie diagramu SVG pojazdu
- ✅ Wsparcie dla różnych typów (GBA, GCBA, SLRt)
- ✅ Konfigurowalne wymiary
- ✅ Eksport do SVG (wektorowy)
- ✅ Eksport do PNG (rastrowy)
- ✅ Profesjonalny wygląd z legendą
- ✅ Wymiary pojazdu
- ✅ Kolorowe schowki

**Strona:** `/vehicle-generator`

**Użycie komponentu:**
```tsx
import { VehicleSVGGenerator } from '@/components/vehicle-svg-generator';

<VehicleSVGGenerator
  type="GBA"
  width={800}
  height={500}
  className="max-w-full"
/>
```

**Dostępne typy:**
- `GBA` - Średni samochód ratowniczo-gaśniczy ✅ (gotowy)
- `GCBA` - Ciężki samochód ratowniczo-gaśniczy (w przygotowaniu)
- `SLRt` - Samochód lekki ratownictwa technicznego (w przygotowaniu)
- `SLRr` - Samochód lekki ratownictwa ratowniczego (w przygotowaniu)
- `SLOP` - Samochód lekki operacyjny (w przygotowaniu)

**Eksport:**

SVG (wektorowy):
```typescript
const handleDownloadSVG = () => {
  const svg = document.getElementById('vehicle-svg');
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  // ... pobierz plik
};
```

PNG (rastrowy):
```typescript
const handleDownloadPNG = () => {
  // Konwersja SVG → Canvas → PNG
  // Automatyczna obsługa w komponencie
};
```

**Zalety SVG:**
- ✅ Skalowalny bez utraty jakości
- ✅ Mały rozmiar pliku
- ✅ Edytowalny w Inkscape/Illustrator
- ✅ Idealny do dokumentacji

**Zalety PNG:**
- ✅ Uniwersalny format
- ✅ Lepszy do druku
- ✅ Obsługiwany wszędzie

---

## Workflow: Od zdjęcia do pełnej konfiguracji

### Krok 1: Przygotuj zdjęcie lub wygeneruj diagram

**Opcja A: Użyj własnego zdjęcia**
1. Zrób zdjęcie pojazdu z góry (dron, drabina)
2. Zapisz jako JPG/PNG
3. Umieść w `public/vehicles/`

**Opcja B: Wygeneruj diagram SVG**
1. Przejdź do `/vehicle-generator`
2. Wybierz typ pojazdu
3. Dostosuj wymiary
4. Pobierz SVG lub PNG
5. Umieść w `public/vehicles/`

### Krok 2: Dodaj pojazd do konfiguracji

W `data/vehicle-configurations.ts`:
```typescript
export const NOWY_POJAZD: VehicleConfiguration = {
  id: 'nowy-pojazd',
  name: 'GBA 2/16',
  type: 'GBA',
  views: [
    {
      id: 'view-1',
      name: 'Widok główny',
      imageUrl: '/vehicles/nowy-pojazd.jpg',
    },
  ],
  compartments: [],  // Dodamy w następnym kroku
  // ... reszta konfiguracji
};
```

### Krok 3: Dodaj schowki w edytorze

1. Przejdź do `/vehicle-equipment`
2. Wybierz pojazd
3. Zakładka **"Zarządzanie"** → Dodaj schowki
4. Zakładka **"Pozycje"** → Przeciągnij schowki na właściwe miejsca

### Krok 4: Dodaj wyposażenie

1. Zakładka **"Zarządzanie"**
2. Wybierz schowek
3. Kliknij **"Dodaj element"**
4. Wypełnij formularz (nazwa, kategoria, ilość)
5. Zapisz

### Krok 5: Sprawdź i udostępnij

1. Zakładka **"Podgląd"** - zobacz efekt końcowy
2. Zakładka **"Statystyki"** - sprawdź podsumowanie
3. Dane są automatycznie zapisane w localStorage

---

## Zaawansowane funkcje

### Wielokrotne widoki pojazdu

Możesz dodać wiele zdjęć tego samego pojazdu:

```typescript
views: [
  {
    id: 'view-top',
    name: 'Widok z góry',
    imageUrl: '/vehicles/gba-top.jpg',
  },
  {
    id: 'view-side',
    name: 'Widok z boku',
    imageUrl: '/vehicles/gba-side.jpg',
  },
  {
    id: 'view-rear',
    name: 'Widok z tyłu',
    imageUrl: '/vehicles/gba-rear.jpg',
  },
]
```

Użytkownik może przełączać się między widokami w komponencie `VehicleEquipmentViewer`.

### Kolorowe kodowanie schowków

Sugerowane kolory dla lepszej organizacji:

```typescript
const COMPARTMENT_COLORS = {
  FRONT_LEFT: '#ef4444',    // Czerwony
  FRONT_RIGHT: '#ef4444',   // Czerwony
  REAR_LEFT: '#10b981',     // Zielony
  REAR_RIGHT: '#10b981',    // Zielony
  CABIN: '#3b82f6',         // Niebieski
  PUMP: '#f97316',          // Pomarańczowy
  SPECIAL: '#8b5cf6',       // Fioletowy
};
```

### Eksport konfiguracji

Możesz wyeksportować całą konfigurację pojazdu:

```typescript
const exportVehicleConfig = (vehicle: VehicleConfiguration) => {
  const json = JSON.stringify(vehicle, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${vehicle.id}-config.json`;
  link.click();
};
```

### Import konfiguracji

```typescript
const importVehicleConfig = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const config = JSON.parse(e.target?.result as string);
    addVehicle(config);
  };
  reader.readAsText(file);
};
```

---

## Licencja

© 2025 OSP Commander - Zbudowane z ❤️ dla polskich strażaków

