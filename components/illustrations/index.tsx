'use client'

import type { ComponentType } from 'react'
import type { IllustrationProps } from '@/components/coloring/illustration-kit'
import { CuriosityArt } from './curiosity-art'
import { PerseveranceArt } from './perseverance-art'
import { HistoricArt } from './historic-art'

export const ILLUSTRATIONS: Record<string, ComponentType<Omit<IllustrationProps, 'title'>>> = {
  perseverance: PerseveranceArt,
  curiosity: CuriosityArt,
  ingenuity: HistoricArt,
  opportunity: HistoricArt,
  sojourner: HistoricArt,
  'lunar-rover': HistoricArt,
}
