import type { Metadata } from 'next'
import { LegacyHub } from '@/components/legacy/legacy-hub'
import { SpaceBackground } from '@/components/space-background'
import { DESTINATIONS, type Destination } from '@/lib/legacy/explorers'

export const metadata: Metadata = {
  title: 'The Silent Explorers — NASA Space Explorers',
  description:
    'Explore a map of the hardware NASA left on the Moon, on Mars and in deep space, and hear each machine tell its own story.',
}

export default async function StoriesPage({ searchParams }: { searchParams: Promise<{ at?: string }> }) {
  const { at } = await searchParams
  const destination: Destination = DESTINATIONS.some((d) => d.id === at) ? (at as Destination) : 'moon'
  return (
    <>
      <SpaceBackground dense={false} />
      <LegacyHub destination={destination} />
    </>
  )
}
