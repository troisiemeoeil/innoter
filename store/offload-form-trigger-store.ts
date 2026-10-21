import { create } from "zustand"

type UiStore = {
    isDrawerOpen: boolean
    openDrawer: () => void
    closeDrawer: () => void
    setDrawerOpen: (open: boolean) => void
    pendingGeometry: GeoJSON.Feature<GeoJSON.Polygon> | null
    setPendingGeometry: (feature: GeoJSON.Feature<GeoJSON.Polygon> | null) => void
}

export const useUiStore = create<UiStore>((set) => ({
    isDrawerOpen: false,
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    pendingGeometry: null,
    setPendingGeometry: (feature) => set({ pendingGeometry: feature }),
    
}))