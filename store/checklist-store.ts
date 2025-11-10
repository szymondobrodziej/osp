import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChecklistTemplate, ChecklistTemplateCategory, ChecklistTemplateItem, IncidentType, Priority } from '@/types/incident';
import { CHECKLIST_TEMPLATES } from '@/data/checklist-templates';

interface ChecklistStore {
  // Custom checklisty stworzone przez użytkownika
  customTemplates: ChecklistTemplate[];
  
  // Wszystkie checklisty (built-in + custom)
  getAllTemplates: () => ChecklistTemplate[];
  
  // Pobierz szablon po ID
  getTemplateById: (id: string) => ChecklistTemplate | undefined;
  
  // Pobierz szablony dla typu zdarzenia
  getTemplatesByType: (type: IncidentType) => ChecklistTemplate[];
  
  // Stwórz nowy custom szablon
  createTemplate: (template: Omit<ChecklistTemplate, 'id' | 'isBuiltIn' | 'createdAt' | 'updatedAt'>) => ChecklistTemplate;
  
  // Aktualizuj szablon
  updateTemplate: (id: string, updates: Partial<ChecklistTemplate>) => void;
  
  // Usuń szablon
  deleteTemplate: (id: string) => void;
  
  // Duplikuj szablon (built-in -> custom)
  duplicateTemplate: (id: string, newName: string) => ChecklistTemplate | undefined;
  
  // Eksport szablonu do JSON
  exportTemplate: (id: string) => string | undefined;
  
  // Import szablonu z JSON
  importTemplate: (json: string) => ChecklistTemplate | undefined;
  
  // Dodaj kategorię do szablonu
  addCategory: (templateId: string, category: Omit<ChecklistTemplateCategory, 'id'>) => void;
  
  // Aktualizuj kategorię
  updateCategory: (templateId: string, categoryId: string, updates: Partial<ChecklistTemplateCategory>) => void;
  
  // Usuń kategorię
  deleteCategory: (templateId: string, categoryId: string) => void;
  
  // Dodaj item do kategorii
  addItem: (templateId: string, categoryId: string, item: Omit<ChecklistTemplateItem, 'id'>) => void;
  
  // Aktualizuj item
  updateItem: (templateId: string, categoryId: string, itemId: string, updates: Partial<ChecklistTemplateItem>) => void;
  
  // Usuń item
  deleteItem: (templateId: string, categoryId: string, itemId: string) => void;
  
  // Zmień kolejność kategorii
  reorderCategories: (templateId: string, categoryIds: string[]) => void;
  
  // Zmień kolejność items w kategorii
  reorderItems: (templateId: string, categoryId: string, itemIds: string[]) => void;
}

// Helper do generowania ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      customTemplates: [],
      
      getAllTemplates: () => {
        const customTemplates = get().customTemplates;
        const customIds = new Set(customTemplates.map(t => t.id));

        // Wbudowane szablony - tylko te, które nie zostały nadpisane przez custom
        const builtInTemplates: ChecklistTemplate[] = Object.entries(CHECKLIST_TEMPLATES)
          .filter(([key]) => !customIds.has(key)) // Pomiń te, które mają custom wersję
          .map(([key, template]) => ({
            id: key,
            name: template.name || key,
            description: template.description,
            incidentType: key as IncidentType,
            isBuiltIn: true,
            categories: template.categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              order: cat.order,
              items: cat.items.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                priority: item.priority,
                estimatedDuration: item.estimatedDuration,
                assignedTo: item.assignedTo,
                requiredFor: item.requiredFor,
              })),
            })),
          }));

        // Custom szablony nadpisują wbudowane (jeśli mają to samo ID)
        return [...builtInTemplates, ...customTemplates];
      },
      
      getTemplateById: (id: string) => {
        return get().getAllTemplates().find(t => t.id === id);
      },
      
      getTemplatesByType: (type: IncidentType) => {
        return get().getAllTemplates().filter(t => t.incidentType === type || t.incidentType === 'CUSTOM');
      },
      
      createTemplate: (template) => {
        const newTemplate: ChecklistTemplate = {
          ...template,
          id: generateId(),
          isBuiltIn: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          customTemplates: [...state.customTemplates, newTemplate],
        }));
        
        return newTemplate;
      },
      
      updateTemplate: (id, updates) => {
        console.log('🔧 Store: updateTemplate wywołane:', {
          id,
          updates: {
            ...updates,
            categoriesCount: updates.categories?.length,
          },
        });
        set(state => {
          // Sprawdź czy szablon istnieje w customTemplates
          const existsInCustom = state.customTemplates.some(t => t.id === id);

          if (existsInCustom) {
            // Aktualizuj istniejący custom szablon
            const newTemplates = state.customTemplates.map(t =>
              t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
            );
            console.log('🔧 Store: Zaktualizowano custom szablon:', id);
            return { customTemplates: newTemplates };
          } else {
            // To jest wbudowany szablon - stwórz custom wersję (nadpisanie)
            const builtInTemplate = get().getTemplateById(id);
            if (builtInTemplate) {
              const customVersion: ChecklistTemplate = {
                ...builtInTemplate,
                ...updates,
                id, // Zachowaj to samo ID
                isBuiltIn: false, // Teraz to custom szablon
                updatedAt: new Date(),
              };
              console.log('🔧 Store: Utworzono custom wersję wbudowanego szablonu:', id);
              return { customTemplates: [...state.customTemplates, customVersion] };
            }
            console.warn('⚠️ Store: Nie znaleziono szablonu:', id);
            return state;
          }
        });
      },
      
      deleteTemplate: (id) => {
        set(state => ({
          customTemplates: state.customTemplates.filter(t => t.id !== id),
        }));
      },
      
      duplicateTemplate: (id, newName) => {
        const template = get().getTemplateById(id);
        if (!template) return undefined;
        
        const duplicated = get().createTemplate({
          name: newName,
          description: template.description,
          incidentType: 'CUSTOM',
          createdBy: template.createdBy,
          categories: template.categories.map(cat => ({
            ...cat,
            id: generateId(),
            items: cat.items.map(item => ({
              ...item,
              id: generateId(),
            })),
          })),
        });
        
        return duplicated;
      },
      
      exportTemplate: (id) => {
        const template = get().getTemplateById(id);
        if (!template) return undefined;
        
        return JSON.stringify(template, null, 2);
      },
      
      importTemplate: (json) => {
        try {
          const imported = JSON.parse(json) as ChecklistTemplate;
          
          // Regeneruj ID żeby uniknąć konfliktów
          const newTemplate = get().createTemplate({
            name: `${imported.name} (Imported)`,
            description: imported.description,
            incidentType: imported.incidentType,
            createdBy: imported.createdBy,
            categories: imported.categories.map(cat => ({
              ...cat,
              id: generateId(),
              items: cat.items.map(item => ({
                ...item,
                id: generateId(),
              })),
            })),
          });
          
          return newTemplate;
        } catch (error) {
          console.error('Failed to import template:', error);
          return undefined;
        }
      },
      
      addCategory: (templateId, category) => {
        const newCategory: ChecklistTemplateCategory = {
          ...category,
          id: generateId(),
        };
        
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: [...t.categories, newCategory],
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      updateCategory: (templateId, categoryId, updates) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.map(c =>
                    c.id === categoryId ? { ...c, ...updates } : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      deleteCategory: (templateId, categoryId) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.filter(c => c.id !== categoryId),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      addItem: (templateId, categoryId, item) => {
        const newItem: ChecklistTemplateItem = {
          ...item,
          id: generateId(),
        };
        
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.map(c =>
                    c.id === categoryId
                      ? { ...c, items: [...c.items, newItem] }
                      : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      updateItem: (templateId, categoryId, itemId, updates) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.map(c =>
                    c.id === categoryId
                      ? {
                          ...c,
                          items: c.items.map(i =>
                            i.id === itemId ? { ...i, ...updates } : i
                          ),
                        }
                      : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      deleteItem: (templateId, categoryId, itemId) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.map(c =>
                    c.id === categoryId
                      ? { ...c, items: c.items.filter(i => i.id !== itemId) }
                      : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      reorderCategories: (templateId, categoryIds) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: categoryIds
                    .map(id => t.categories.find(c => c.id === id))
                    .filter(Boolean)
                    .map((c, index) => ({ ...c!, order: index + 1 })),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
      
      reorderItems: (templateId, categoryId, itemIds) => {
        set(state => ({
          customTemplates: state.customTemplates.map(t =>
            t.id === templateId
              ? {
                  ...t,
                  categories: t.categories.map(c =>
                    c.id === categoryId
                      ? {
                          ...c,
                          items: itemIds
                            .map(id => c.items.find(i => i.id === id))
                            .filter(Boolean) as ChecklistTemplateItem[],
                        }
                      : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        }));
      },
    }),
    {
      name: 'osp-checklist-storage',
    }
  )
);

// Eksportuj store globalnie dla dostępu z incident-store
if (typeof window !== 'undefined') {
  (window as any).__checklistStore = useChecklistStore;
}

