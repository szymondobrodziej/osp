// Kategorie wyposażenia
export type EquipmentCategory = 
  | 'HOSES'           // Węże
  | 'NOZZLES'         // Prądownice
  | 'LADDERS'         // Drabiny
  | 'RESCUE'          // Sprzęt ratowniczy
  | 'MEDICAL'         // Sprzęt medyczny
  | 'TOOLS'           // Narzędzia
  | 'BREATHING'       // Sprzęt oddechowy
  | 'LIGHTING'        // Oświetlenie
  | 'PUMPS'           // Pompy
  | 'COMMUNICATION'   // Łączność
  | 'PPE'             // Środki ochrony osobistej
  | 'EXTINGUISHING'   // Środki gaśnicze
  | 'OTHER';          // Inne

// Etykiety kategorii po polsku
export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  HOSES: 'Węże',
  NOZZLES: 'Prądownice',
  LADDERS: 'Drabiny',
  RESCUE: 'Sprzęt ratowniczy',
  MEDICAL: 'Sprzęt medyczny',
  TOOLS: 'Narzędzia',
  BREATHING: 'Sprzęt oddechowy',
  LIGHTING: 'Oświetlenie',
  PUMPS: 'Pompy',
  COMMUNICATION: 'Łączność',
  PPE: 'Środki ochrony osobistej',
  EXTINGUISHING: 'Środki gaśnicze',
  OTHER: 'Inne',
};

// Ikony dla kategorii (Lucide icons)
export const EQUIPMENT_CATEGORY_ICONS: Record<EquipmentCategory, string> = {
  HOSES: 'cable',
  NOZZLES: 'spray-can',
  LADDERS: 'ladder',
  RESCUE: 'life-buoy',
  MEDICAL: 'heart-pulse',
  TOOLS: 'wrench',
  BREATHING: 'wind',
  LIGHTING: 'lightbulb',
  PUMPS: 'gauge',
  COMMUNICATION: 'radio',
  PPE: 'shield',
  EXTINGUISHING: 'flame',
  OTHER: 'package',
};

// Pojedynczy element wyposażenia
export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  unit?: string; // 'szt', 'm', 'kg', etc.
  description?: string;
  location: string; // ID schowka
  icon?: string;
  image?: string;
  notes?: string;
  expiryDate?: string; // Data ważności w formacie ISO (YYYY-MM-DD) lub undefined jeśli brak
}

// Schowek/przedział w pojeździe
export interface VehicleCompartment {
  id: string;
  name: string;
  position: {
    x: number; // Pozycja na schemacie (%)
    y: number;
  };
  size: {
    width: number; // Rozmiar na schemacie (%)
    height: number;
  };
  color?: string; // Kolor tła schowka
  items: EquipmentItem[];
  description?: string;
}

// Typ pojazdu
export type VehicleType = 'GBA' | 'GCBA' | 'SLRT' | 'SLRt' | 'GLBA' | 'GLM' | 'OTHER';

// Etykiety typów pojazdów
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  GBA: 'GBA - Średni samochód ratowniczo-gaśniczy',
  GCBA: 'GCBA - Ciężki samochód ratowniczo-gaśniczy',
  SLRT: 'SLRt - Lekki samochód ratownictwa technicznego',
  SLRt: 'SLRt - Lekki samochód ratownictwa technicznego',
  GLBA: 'GLBA - Lekki samochód ratowniczo-gaśniczy',
  GLM: 'GLM - Samochód gaśniczy z drabiną mechaniczną',
  OTHER: 'Inny pojazd',
};

// Widok pojazdu (dla różnych zdjęć/schematów)
export interface VehicleView {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

// Kompletna konfiguracja pojazdu
export interface VehicleConfiguration {
  id: string;
  name: string; // np. "GBA 2/16 - MAN TGM"
  type: VehicleType;
  registrationNumber?: string;
  compartments: VehicleCompartment[];
  views: VehicleView[]; // Różne widoki (z góry, z boku, etc.)
  specifications?: {
    waterTank?: number; // Litry
    foamTank?: number;
    pump?: string; // np. "TS 8/8"
    crew?: number;
    manufacturer?: string;
    model?: string;
    year?: number;
  };
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
  };
}

// Statystyki wyposażenia
export interface EquipmentStats {
  totalItems: number;
  itemsByCategory: Record<EquipmentCategory, number>;
  compartmentCount: number;
}

