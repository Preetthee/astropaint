import type { Metadata } from 'next'
import { LevelSelector } from '@/components/level-selector'
import { SpaceBackground } from '@/components/space-background'

export const metadata: Metadata = {
  title: 'Choose a level — NASA Space Explorers',
}

export default function LevelsPage() {
  return (
    <>
      <SpaceBackground dense={false} />
      <LevelSelector />
    </>
  )
}
