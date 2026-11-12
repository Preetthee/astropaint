import { curiosity } from './curiosity'
import { perseverance } from './perseverance'
import type { LevelData } from './types'

export const LEVELS: LevelData[] = [perseverance, curiosity].sort((a, b) => a.order - b.order)

export const getLevel = (id: string) => LEVELS.find((l) => l.id === id)

export const getNextLevel = (id: string) => {
  const current = getLevel(id)
  return current ? LEVELS.find((l) => l.order === current.order + 1) : undefined
}

export type { LevelData } from './types'
