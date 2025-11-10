import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Incident, ChecklistItem, ChecklistItemStatus, CasualtyInfo, ResourceInfo, IncidentType, ChecklistTemplateCategory } from '@/types/incident';
import { CHECKLIST_TEMPLATES } from '@/data/checklist-templates';

interface IncidentStore {
  // Stan
  currentIncident: Incident | null;
  incidents: Incident[];

  // Akcje - Zarządzanie zdarzeniem
  createIncident: (type: IncidentType, title: string, location: string, commander: string, templateId?: string) => void;
  updateIncident: (updates: Partial<Incident>) => void;
  setIncidentStatus: (status: Incident['status']) => void;
  completeIncident: () => void;
  
  // Akcje - Checklisty
  updateChecklistItem: (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  completeChecklistItem: (categoryId: string, itemId: string, notes?: string) => void;
  skipChecklistItem: (categoryId: string, itemId: string, reason: string) => void;
  
  // Akcje - Poszkodowani
  addCasualty: (casualty: Omit<CasualtyInfo, 'id'>) => void;
  updateCasualty: (id: string, updates: Partial<CasualtyInfo>) => void;
  removeCasualty: (id: string) => void;
  
  // Akcje - Siły i środki
  addResource: (resource: Omit<ResourceInfo, 'id'>) => void;
  updateResource: (id: string, updates: Partial<ResourceInfo>) => void;
  removeResource: (id: string) => void;
  
  // Akcje - Notatki
  addNote: (content: string, category?: 'OBSERVATION' | 'DECISION' | 'COMMUNICATION' | 'OTHER') => void;
  
  // Akcje - Zdjęcia
  addPhoto: (url: string, description?: string) => void;
  
  // Akcje - Czasy
  markArrived: () => void;
  markControlled: () => void;
  
  // Pomocnicze
  getProgress: () => { completed: number; total: number; percentage: number };
  clearCurrentIncident: () => void;
}

export const useIncidentStore = create<IncidentStore>()(
  persist(
    (set, get) => ({
      currentIncident: null,
      incidents: [],
      
      createIncident: (type, title, location, commander, templateId) => {
        // Pobierz szablon - albo custom z templateId, albo domyślny dla typu
        let templateCategories;

        if (templateId) {
          // Próbuj pobrać custom template z checklist store
          // Musimy to zrobić dynamicznie, bo nie możemy importować store w store
          const checklistStore = (window as any).__checklistStore;
          if (checklistStore) {
            const template = checklistStore.getState().getTemplateById(templateId);
            if (template) {
              templateCategories = template.categories;
            }
          }
        }

        // Fallback do domyślnego szablonu
        if (!templateCategories) {
          const template = CHECKLIST_TEMPLATES[type];
          templateCategories = template.categories;
        }

        const now = new Date();

        // Domyślne współrzędne (centrum Polski)
        const defaultCoordinates = {
          lat: 52.2297,
          lng: 21.0122,
        };

        const newIncident: Incident = {
          id: `incident-${Date.now()}`,
          type,
          status: 'DISPATCHED',
          priority: 'HIGH',
          title,
          description: '',
          location: {
            address: location,
            coordinates: defaultCoordinates,
          },
          reportedAt: now,
          dispatchedAt: now,
          commander,
          team: [],
          checklists: templateCategories.map((cat: ChecklistTemplateCategory) => ({
            ...cat,
            items: cat.items.map(item => ({
              ...item,
              status: 'PENDING' as ChecklistItemStatus,
            })),
          })),
          casualties: [],
          resources: [],
          notes: [],
          photos: [],
          metadata: {
            createdBy: commander,
            createdAt: now,
            updatedAt: now,
            version: 1,
          },
        };

        set(state => ({
          currentIncident: newIncident,
          incidents: [...state.incidents, newIncident],
        }));

        console.log('🚒 Zdarzenie utworzone z domyślnymi współrzędnymi:', defaultCoordinates);

        // Pobierz geolokalizację w tle i zaktualizuj współrzędne
        if (typeof window !== 'undefined' && navigator.geolocation) {
          console.log('📍 Rozpoczynam pobieranie geolokalizacji...');

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              console.log('📍 Geolokalizacja pobrana:', coordinates);

              // Zaktualizuj współrzędne zdarzenia
              const currentState = get();
              if (currentState.currentIncident) {
                currentState.updateIncident({
                  location: {
                    address: currentState.currentIncident.location.address,
                    coordinates,
                    accessNotes: currentState.currentIncident.location.accessNotes,
                  },
                });
                console.log('✅ Geolokalizacja zaktualizowana w zdarzeniu');
              }
            },
            (error) => {
              console.error('❌ Błąd geolokalizacji:', {
                code: error.code,
                message: error.message,
                PERMISSION_DENIED: error.code === 1,
                POSITION_UNAVAILABLE: error.code === 2,
                TIMEOUT: error.code === 3,
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          console.warn('⚠️ Geolokalizacja niedostępna (brak navigator.geolocation)');
        }
      },
      
      updateIncident: (updates) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const updatedIncident = {
            ...state.currentIncident,
            ...updates,
            metadata: {
              ...state.currentIncident.metadata,
              updatedAt: new Date(),
              version: state.currentIncident.metadata.version + 1,
            },
          };
          
          return {
            currentIncident: updatedIncident,
            incidents: state.incidents.map(inc =>
              inc.id === updatedIncident.id ? updatedIncident : inc
            ),
          };
        });
      },
      
      setIncidentStatus: (status) => {
        get().updateIncident({ status });
      },
      
      completeIncident: () => {
        get().updateIncident({
          status: 'COMPLETED',
          completedAt: new Date(),
        });
      },
      
      updateChecklistItem: (categoryId, itemId, updates) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const updatedChecklists = state.currentIncident.checklists.map(category => {
            if (category.id !== categoryId) return category;
            
            return {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            };
          });
          
          const updatedIncident = {
            ...state.currentIncident,
            checklists: updatedChecklists,
            metadata: {
              ...state.currentIncident.metadata,
              updatedAt: new Date(),
              version: state.currentIncident.metadata.version + 1,
            },
          };
          
          return {
            currentIncident: updatedIncident,
            incidents: state.incidents.map(inc =>
              inc.id === updatedIncident.id ? updatedIncident : inc
            ),
          };
        });
      },
      
      completeChecklistItem: (categoryId, itemId, notes) => {
        get().updateChecklistItem(categoryId, itemId, {
          status: 'COMPLETED',
          completedAt: new Date(),
          notes,
        });
      },
      
      skipChecklistItem: (categoryId, itemId, reason) => {
        get().updateChecklistItem(categoryId, itemId, {
          status: 'SKIPPED',
          notes: reason,
        });
      },
      
      addCasualty: (casualty) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const newCasualty: CasualtyInfo = {
            ...casualty,
            id: `casualty-${Date.now()}`,
          };
          
          return {
            currentIncident: {
              ...state.currentIncident,
              casualties: [...state.currentIncident.casualties, newCasualty],
            },
          };
        });
      },
      
      updateCasualty: (id, updates) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          return {
            currentIncident: {
              ...state.currentIncident,
              casualties: state.currentIncident.casualties.map(c =>
                c.id === id ? { ...c, ...updates } : c
              ),
            },
          };
        });
      },
      
      removeCasualty: (id) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          return {
            currentIncident: {
              ...state.currentIncident,
              casualties: state.currentIncident.casualties.filter(c => c.id !== id),
            },
          };
        });
      },
      
      addResource: (resource) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const newResource: ResourceInfo = {
            ...resource,
            id: `resource-${Date.now()}`,
          };
          
          return {
            currentIncident: {
              ...state.currentIncident,
              resources: [...state.currentIncident.resources, newResource],
            },
          };
        });
      },
      
      updateResource: (id, updates) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          return {
            currentIncident: {
              ...state.currentIncident,
              resources: state.currentIncident.resources.map(r =>
                r.id === id ? { ...r, ...updates } : r
              ),
            },
          };
        });
      },
      
      removeResource: (id) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          return {
            currentIncident: {
              ...state.currentIncident,
              resources: state.currentIncident.resources.filter(r => r.id !== id),
            },
          };
        });
      },
      
      addNote: (content, category = 'OBSERVATION') => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const newNote = {
            id: `note-${Date.now()}`,
            timestamp: new Date(),
            author: state.currentIncident.commander,
            content,
            category,
          };
          
          return {
            currentIncident: {
              ...state.currentIncident,
              notes: [...state.currentIncident.notes, newNote],
            },
          };
        });
      },
      
      addPhoto: (url, description) => {
        set(state => {
          if (!state.currentIncident) return state;
          
          const newPhoto = {
            id: `photo-${Date.now()}`,
            url,
            timestamp: new Date(),
            description,
          };
          
          return {
            currentIncident: {
              ...state.currentIncident,
              photos: [...state.currentIncident.photos, newPhoto],
            },
          };
        });
      },
      
      markArrived: () => {
        get().updateIncident({
          status: 'ON_SCENE',
          arrivedAt: new Date(),
        });
      },
      
      markControlled: () => {
        get().updateIncident({
          status: 'CONTROLLED',
          controlledAt: new Date(),
        });
      },
      
      getProgress: () => {
        const incident = get().currentIncident;
        if (!incident) return { completed: 0, total: 0, percentage: 0 };
        
        let completed = 0;
        let total = 0;
        
        incident.checklists.forEach(category => {
          category.items.forEach(item => {
            total++;
            if (item.status === 'COMPLETED') completed++;
          });
        });
        
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      },
      
      clearCurrentIncident: () => {
        set({ currentIncident: null });
      },
    }),
    {
      name: 'osp-incident-storage',
      partialize: (state) => ({
        incidents: state.incidents,
        currentIncident: state.currentIncident,
      }),
    }
  )
);

