import { create } from 'zustand';

interface ScheduledDrop {
   id: string;
   truck: string;
   time: string;
   notes?: string;
}

interface OffloadingArea {
   id: string;
   geometry: GeoJSON.Feature<GeoJSON.Polygon>;
   name: string;
   status: 'available' | 'occupied' | 'scheduled';
   truck?: string;
   scheduledDrops: ScheduledDrop[];
   notes?: string;
}

interface OffloadingAreaState {
   areas: OffloadingArea[];
   selectedAreaId: string | null;
   addArea: (area: OffloadingArea) => void;
   updateArea: (id: string, updates: Partial<OffloadingArea>) => void;
   removeArea: (id: string) => void;
   selectArea: (id: string | null) => void;
   addScheduledDrop: (areaId: string, drop: ScheduledDrop) => void;
   removeScheduledDrop: (areaId: string, dropId: string) => void;
   clearAreas: () => void;
}

export const useOffloadingAreaStore = create<OffloadingAreaState>((set, get) => ({
   areas: [],
   selectedAreaId: null,

   addArea: (area) => set((state) => ({ areas: [...state.areas, area] })),

   updateArea: (id, updates) =>
      set((state) => ({
         areas: state.areas.map((area) => (area.id === id ? { ...area, ...updates } : area)),
      })),

   removeArea: (id) =>
      set((state) => ({
         areas: state.areas.filter((area) => area.id !== id),
         selectedAreaId: get().selectedAreaId === id ? null : get().selectedAreaId,
      })),

   selectArea: (id) => set({ selectedAreaId: id }),

   addScheduledDrop: (areaId, drop) =>
      set((state) => ({
         areas: state.areas.map((area) =>
            area.id === areaId ? { ...area, scheduledDrops: [...area.scheduledDrops, drop] } : area
         ),
      })),

   removeScheduledDrop: (areaId, dropId) =>
      set((state) => ({
         areas: state.areas.map((area) =>
            area.id === areaId
               ? {
                    ...area,
                    scheduledDrops: area.scheduledDrops.filter((drop) => drop.id !== dropId),
                 }
               : area
         ),
      })),

   clearAreas: () => set({ areas: [], selectedAreaId: null }),
})); 