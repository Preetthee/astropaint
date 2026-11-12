'use client'

import { createLocalStore, useLocalStore } from './local-store'

export interface Settings {
  voice: boolean
  sfx: boolean
  music: boolean
  muted: boolean
}

export const settingsStore = createLocalStore<Settings>('nse:settings:v1', {
  voice: true,
  sfx: true,
  music: false,
  muted: false,
})

export const useSettings = () => useLocalStore(settingsStore)

export const updateSettings = (patch: Partial<Settings>) =>
  settingsStore.set((prev) => ({ ...prev, ...patch }))
