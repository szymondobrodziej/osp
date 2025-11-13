import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VehicleConfiguration, EquipmentItem, VehicleCompartment, EquipmentStats } from '@/types/vehicle-equipment';
import { VEHICLE_CONFIGURATIONS } from '@/data/vehicle-configurations';

interface VehicleEquipmentStore {
  // Stan
  vehicles: VehicleConfiguration[];
  currentVehicleId: string | null;
  
  // Akcje - Zarządzanie pojazdami
  loadDefaultVehicles: () => void;
  setCurrentVehicle: (vehicleId: string) => void;
  getCurrentVehicle: () => VehicleConfiguration | null;
  addVehicle: (vehicle: VehicleConfiguration) => void;
  updateVehicle: (vehicleId: string, updates: Partial<VehicleConfiguration>) => void;
  deleteVehicle: (vehicleId: string) => void;
  
  // Akcje - Zarządzanie wyposażeniem
  addEquipmentItem: (vehicleId: string, compartmentId: string, item: Omit<EquipmentItem, 'id'>) => void;
  updateEquipmentItem: (vehicleId: string, compartmentId: string, itemId: string, updates: Partial<EquipmentItem>) => void;
  deleteEquipmentItem: (vehicleId: string, compartmentId: string, itemId: string) => void;
  moveEquipmentItem: (vehicleId: string, itemId: string, fromCompartmentId: string, toCompartmentId: string) => void;
  
  // Akcje - Zarządzanie schowkami
  addCompartment: (vehicleId: string, compartment: Omit<VehicleCompartment, 'items'>) => void;
  updateCompartment: (vehicleId: string, compartmentId: string, updates: Partial<VehicleCompartment>) => void;
  deleteCompartment: (vehicleId: string, compartmentId: string) => void;
  
  // Pomocnicze
  getEquipmentStats: (vehicleId: string) => EquipmentStats;
  searchEquipment: (vehicleId: string, query: string) => EquipmentItem[];
  getCompartmentById: (vehicleId: string, compartmentId: string) => VehicleCompartment | null;
}

export const useVehicleEquipmentStore = create<VehicleEquipmentStore>()(
  persist(
    (set, get) => ({
      vehicles: [],
      currentVehicleId: null,
      
      loadDefaultVehicles: () => {
        const state = get();
        if (state.vehicles.length === 0) {
          set({ 
            vehicles: VEHICLE_CONFIGURATIONS,
            currentVehicleId: VEHICLE_CONFIGURATIONS[0]?.id || null,
          });
        }
      },
      
      setCurrentVehicle: (vehicleId) => {
        set({ currentVehicleId: vehicleId });
      },
      
      getCurrentVehicle: () => {
        const state = get();
        return state.vehicles.find(v => v.id === state.currentVehicleId) || null;
      },
      
      addVehicle: (vehicle) => {
        set(state => ({
          vehicles: [...state.vehicles, vehicle],
        }));
      },
      
      updateVehicle: (vehicleId, updates) => {
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  ...updates,
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      deleteVehicle: (vehicleId) => {
        set(state => ({
          vehicles: state.vehicles.filter(v => v.id !== vehicleId),
          currentVehicleId: state.currentVehicleId === vehicleId ? null : state.currentVehicleId,
        }));
      },
      
      addEquipmentItem: (vehicleId, compartmentId, item) => {
        const newItem: EquipmentItem = {
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: v.compartments.map(c =>
                    c.id === compartmentId
                      ? { ...c, items: [...c.items, newItem] }
                      : c
                  ),
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      updateEquipmentItem: (vehicleId, compartmentId, itemId, updates) => {
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: v.compartments.map(c =>
                    c.id === compartmentId
                      ? {
                          ...c,
                          items: c.items.map(item =>
                            item.id === itemId ? { ...item, ...updates } : item
                          ),
                        }
                      : c
                  ),
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      deleteEquipmentItem: (vehicleId, compartmentId, itemId) => {
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: v.compartments.map(c =>
                    c.id === compartmentId
                      ? { ...c, items: c.items.filter(item => item.id !== itemId) }
                      : c
                  ),
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      moveEquipmentItem: (vehicleId, itemId, fromCompartmentId, toCompartmentId) => {
        set(state => {
          const vehicle = state.vehicles.find(v => v.id === vehicleId);
          if (!vehicle) return state;
          
          const fromCompartment = vehicle.compartments.find(c => c.id === fromCompartmentId);
          if (!fromCompartment) return state;
          
          const item = fromCompartment.items.find(i => i.id === itemId);
          if (!item) return state;
          
          return {
            vehicles: state.vehicles.map(v =>
              v.id === vehicleId
                ? {
                    ...v,
                    compartments: v.compartments.map(c => {
                      if (c.id === fromCompartmentId) {
                        return { ...c, items: c.items.filter(i => i.id !== itemId) };
                      }
                      if (c.id === toCompartmentId) {
                        return { ...c, items: [...c.items, { ...item, location: toCompartmentId }] };
                      }
                      return c;
                    }),
                    metadata: {
                      ...v.metadata,
                      updatedAt: new Date(),
                    },
                  }
                : v
            ),
          };
        });
      },
      
      addCompartment: (vehicleId, compartment) => {
        const newCompartment: VehicleCompartment = {
          ...compartment,
          items: [],
        };
        
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: [...v.compartments, newCompartment],
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      updateCompartment: (vehicleId, compartmentId, updates) => {
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: v.compartments.map(c =>
                    c.id === compartmentId ? { ...c, ...updates } : c
                  ),
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      deleteCompartment: (vehicleId, compartmentId) => {
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.id === vehicleId
              ? {
                  ...v,
                  compartments: v.compartments.filter(c => c.id !== compartmentId),
                  metadata: {
                    ...v.metadata,
                    updatedAt: new Date(),
                  },
                }
              : v
          ),
        }));
      },
      
      getEquipmentStats: (vehicleId) => {
        const vehicle = get().vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
          return {
            totalItems: 0,
            itemsByCategory: {} as any,
            compartmentCount: 0,
          };
        }
        
        const stats: EquipmentStats = {
          totalItems: 0,
          itemsByCategory: {
            HOSES: 0,
            NOZZLES: 0,
            LADDERS: 0,
            RESCUE: 0,
            MEDICAL: 0,
            TOOLS: 0,
            BREATHING: 0,
            LIGHTING: 0,
            PUMPS: 0,
            COMMUNICATION: 0,
            PPE: 0,
            EXTINGUISHING: 0,
            OTHER: 0,
          },
          compartmentCount: vehicle.compartments.length,
        };
        
        vehicle.compartments.forEach(compartment => {
          compartment.items.forEach(item => {
            stats.totalItems += item.quantity;
            stats.itemsByCategory[item.category] += item.quantity;
          });
        });
        
        return stats;
      },
      
      searchEquipment: (vehicleId, query) => {
        const vehicle = get().vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return [];
        
        const lowerQuery = query.toLowerCase();
        const results: EquipmentItem[] = [];
        
        vehicle.compartments.forEach(compartment => {
          compartment.items.forEach(item => {
            if (
              item.name.toLowerCase().includes(lowerQuery) ||
              item.description?.toLowerCase().includes(lowerQuery) ||
              item.category.toLowerCase().includes(lowerQuery)
            ) {
              results.push(item);
            }
          });
        });
        
        return results;
      },
      
      getCompartmentById: (vehicleId, compartmentId) => {
        const vehicle = get().vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return null;
        
        return vehicle.compartments.find(c => c.id === compartmentId) || null;
      },
    }),
    {
      name: 'osp-vehicle-equipment-storage',
      partialize: (state) => ({
        vehicles: state.vehicles,
        currentVehicleId: state.currentVehicleId,
      }),
    }
  )
);

