import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GameScreen } from '@/components/game/game-screen'
import { SpaceBackground } from '@/components/space-background'
import { getLevel, LEVELS } from '@/lib/levels'

export function generateStaticParams() {
  return LEVELS.map((l) => ({ id: l.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const level = getLevel(id)
  return { title: level ? `${level.title} — NASA Space Explorers` : 'Level not found' }
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getLevel(id)) notFound()
  return (
    <>
      <SpaceBackground dense={false} />
      <GameScreen levelId={id} />
    </>
  )
}
