'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewMode = 'grid' | 'list' | 'map'

interface UiState {
  propertyViewMode: ViewMode
  compareIds: string[]
  setPropertyViewMode: (mode: ViewMode) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      propertyViewMode: 'grid',
      compareIds: [],
      setPropertyViewMode: (mode) => set({ propertyViewMode: mode }),
      toggleCompare: (id) => {
        const current = get().compareIds
        if (current.includes(id)) {
          set({ compareIds: current.filter((x) => x !== id) })
        } else if (current.length < 4) {
          set({ compareIds: [...current, id] })
        }
      },
      clearCompare: () => set({ compareIds: [] }),
    }),
    { name: 'aqar-ui', partialize: (s) => ({ compareIds: s.compareIds }) },
  ),
)
