'use client'

import { createLocalStore, useLocalStore } from '@/lib/local-store'

interface Memory {
  /** Explorers whose memory question the player answered correctly. */
  remembered: string[]
}

export const memoryStore = createLocalStore<Memory>('nse:legacy:v1', { remembered: [] })

export const useMemory = () => useLocalStore(memoryStore)

export function markRemembered(id: string) {
  memoryStore.set((prev) =>
    prev.remembered.includes(id) ? prev : { ...prev, remembered: [...prev.remembered, id] },
  )
}
