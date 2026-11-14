import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StoryReader } from '@/components/legacy/story-reader'
import { SpaceBackground } from '@/components/space-background'
import { EXPLORERS, getExplorer } from '@/lib/legacy/explorers'

export function generateStaticParams() {
  return EXPLORERS.map((e) => ({ id: e.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const explorer = getExplorer(id)
  if (!explorer) return {}
  return {
    title: `${explorer.name}'s story — NASA Space Explorers`,
    description: explorer.tagline,
  }
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!getExplorer(id)) notFound()
  return (
    <>
      <SpaceBackground dense={false} />
      <StoryReader key={id} id={id} />
    </>
  )
}
