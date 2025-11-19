// Typy zdarzeń
export type IncidentType = 
  | 'FIRE_BUILDING'           // Pożar budynku
  | 'FIRE_FOREST'             // Pożar lasu
  | 'FIRE_VEHICLE'            // Pożar pojazdu
  | 'FIRE_OUTDOOR'            // Pożar na otwartej przestrzeni
  | 'ACCIDENT_ROAD'           // Wypadek drogowy
  | 'ACCIDENT_INDUSTRIAL'     // Wypadek przemysłowy
  | 'HAZMAT_CHEMICAL'         // Zagrożenie chemiczne
  | 'HAZMAT_ECOLOGICAL'       // Zagrożenie ekologiczne
  | 'RESCUE_WATER'            // Ratownictwo wodne
  | 'RESCUE_HEIGHT'           // Ratownictwo wysokościowe
  | 'RESCUE_TECHNICAL'        // Ratownictwo techniczne
  | 'FLOOD'                   // Powódź
  | 'STORM'                   // Burza/Wichura
  | 'OTHER';                  // Inne

// Priorytety
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Status zdarzenia
export type IncidentStatus = 
  | 'DISPATCHED'    // Zadysponowano
  | 'EN_ROUTE'      // W drodze
  | 'ON_SCENE'      // Na miejscu
  | 'IN_PROGRESS'   // W trakcie działań
  | 'CONTROLLED'    // Opanowane
  | 'COMPLETED'     // Zakończone
  | 'CANCELLED';    // Anulowane

// Strefy zagrożenia (dla zagrożeń chemicznych)
export type HazardZone = 'RED' | 'YELLOW' | 'GREEN';

// Status kroku checklisty
export type ChecklistItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'NOT_APPLICABLE';

// Krok checklisty
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: ChecklistItemStatus;
  priority: Priority;
  assignedTo?: string;
  completedAt?: Date;
  notes?: string;
  subItems?: ChecklistItem[];
  requiredFor?: string[]; // IDs innych kroków, które wymagają tego kroku
  estimatedDuration?: number; // w minutach
}

// Kategoria checklisty
export interface ChecklistCategory {
  id: string;
  name: string;
  icon?: string;
  items: ChecklistItem[];
  order: number;
}

// Informacje o poszkodowanych
export interface CasualtyInfo {
  id: string;
  status: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK'; // Triage
  age?: number;
  gender?: 'M' | 'F' | 'OTHER';
  injuries?: string;
  treatment?: string;
  evacuatedTo?: string;
  evacuatedAt?: Date;
  notes?: string;
}

// Siły i środki
export interface ResourceInfo {
  id: string;
  type: 'VEHICLE' | 'PERSONNEL' | 'EQUIPMENT';
  name: string;
  quantity: number;
  unit?: string;
  arrivedAt?: Date;
  status: 'REQUESTED' | 'EN_ROUTE' | 'ON_SCENE' | 'DEPLOYED' | 'RELEASED';
  notes?: string;
}

// Zdarzenie
export interface Incident {
  id: string;
  type: IncidentType;
  status: IncidentStatus;
  priority: Priority;
  
  // Podstawowe informacje
  title: string;
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    accessNotes?: string;
  };
  
  // Czasy
  reportedAt: Date;
  dispatchedAt?: Date;
  arrivedAt?: Date;
  controlledAt?: Date;
  completedAt?: Date;
  
  // Dowódca i zespół
  commander: string;
  team: string[];
  
  // Checklisty
  checklists: ChecklistCategory[];
  
  // Poszkodowani
  casualties: CasualtyInfo[];
  
  // Siły i środki
  resources: ResourceInfo[];
  
  // Strefy zagrożenia (dla zagrożeń chemicznych)
  hazardZones?: {
    red?: { radius: number; description: string };
    yellow?: { radius: number; description: string };
    green?: { radius: number; description: string };
  };
  
  // Notatki i obserwacje
  notes: {
    id: string;
    timestamp: Date;
    author: string;
    content: string;
    category?: 'OBSERVATION' | 'DECISION' | 'COMMUNICATION' | 'OTHER';
  }[];
  
  // Zdjęcia i dokumentacja
  photos: {
    id: string;
    url: string;
    timestamp: Date;
    description?: string;
  }[];

  // Karta rotacji
  rotation?: any;

  // Warunki pogodowe
  weather?: {
    temperature?: number;
    windSpeed?: number;
    windDirection?: string;
    visibility?: string;
    precipitation?: string;
  };

  // Dodatkowe informacje
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
}

// Szablon checklisty dla różnych typów zdarzeń
export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  incidentType: IncidentType | 'CUSTOM'; // CUSTOM dla własnych szablonów
  isBuiltIn: boolean; // true dla domyślnych, false dla custom
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  categories: ChecklistTemplateCategory[];
}

// Kategoria w szablonie (bez statusów - te są dodawane przy użyciu)
export interface ChecklistTemplateCategory {
  id: string;
  name: string;
  icon?: string;
  order: number;
  items: ChecklistTemplateItem[];
}

// Item w szablonie (bez statusów - te są dodawane przy użyciu)
export interface ChecklistTemplateItem {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  estimatedDuration?: number;
  assignedTo?: string;
  requiredFor?: string[];
}

// Raport z działań
export interface IncidentReport {
  incident: Incident;
  summary: string;
  actionsToken: string[];
  lessonsLearned?: string;
  recommendations?: string;
  generatedAt: Date;
  generatedBy: string;
}

