'use client'

import { createLocalStore, useLocalStore } from './local-store'
import { LEVELS } from './levels'

export type Fills = Record<string, string>

export interface LevelProgress {
  colored: boolean
  completed: boolean
  bestScore: number
  total: number
  discovered: string[]
}

export interface Progress {
  levels: Record<string, LevelProgress>
  artwork: Record<string, Fills>
  /** True once the child has finished or skipped the hands-on tutorial. */
  tutorialSeen?: boolean
}

export const progressStore = createLocalStore<Progress>('nse:progress:v1', {
  levels: {},
  artwork: {},
  tutorialSeen: false,
})

export function setTutorialSeen(seen: boolean) {
  progressStore.set((prev) => ({ ...prev, tutorialSeen: seen }))
}

export const useProgress = () => useLocalStore(progressStore)

const emptyLevel: LevelProgress = {
  colored: false,
  completed: false,
  bestScore: 0,
  total: 0,
  discovered: [],
}

export function getLevelProgress(p: Progress, id: string): LevelProgress {
  return { ...emptyLevel, ...p.levels[id] }
}

export function isLevelUnlocked(p: Progress, id: string): boolean {
  const level = LEVELS.find((l) => l.id === id)
  if (!level) return false
  if (level.order === 1) return true
  const prev = LEVELS.find((l) => l.order === level.order - 1)
  return prev ? getLevelProgress(p, prev.id).completed : true
}

export function updateLevel(id: string, patch: Partial<LevelProgress>) {
  progressStore.set((prev) => ({
    ...prev,
    levels: { ...prev.levels, [id]: { ...getLevelProgress(prev, id), ...patch } },
  }))
}

export function markDiscovered(id: string, componentId: string) {
  progressStore.set((prev) => {
    const lp = getLevelProgress(prev, id)
    if (lp.discovered.includes(componentId)) return prev
    return {
      ...prev,
      levels: { ...prev.levels, [id]: { ...lp, discovered: [...lp.discovered, componentId] } },
    }
  })
}

export function saveArtwork(id: string, fills: Fills) {
  progressStore.set((prev) => ({ ...prev, artwork: { ...prev.artwork, [id]: fills } }))
}

export function recordQuiz(id: string, score: number, total: number, passed: boolean) {
  progressStore.set((prev) => {
    const lp = getLevelProgress(prev, id)
    return {
      ...prev,
      levels: {
        ...prev.levels,
        [id]: {
          ...lp,
          bestScore: Math.max(lp.bestScore, score),
          total,
          completed: lp.completed || passed,
        },
      },
    }
  })
}
