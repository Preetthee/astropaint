'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { sfx } from '@/lib/audio'
import { STATUS_LABEL, toMapPosition, type Explorer } from '@/lib/legacy/explorers'
import { cn } from '@/lib/utils'

const MAPS = {
  moon: {
    src: '/maps/moon.jpg',
    alt: 'Flat map of the whole Moon made from Lunar Reconnaissance Orbiter images, with the near side in the middle',
    credit: 'Map: NASA Scientific Visualization Studio, CGI Moon Kit (LRO data)',
    sourceUrl: 'https://svs.gsfc.nasa.gov/4720',
  },
  mars: {
    src: '/maps/mars.jpg',
    alt: 'Flat map of the whole planet Mars, with ice caps at the top and bottom',
    credit: 'Map: NASA 3D Resources, Mars global texture',
    sourceUrl: 'https://github.com/nasa/NASA-3D-Resources',
  },
} as const

/** Pins whose labels would collide with a neighbor read to the left instead. */
const LABEL_LEFT = new Set(['viking-1'])

export function PlanetMap({
  destination,
  explorers,
  remembered,
}: {
  destination: 'moon' | 'mars'
  explorers: Explorer[]
  remembered: string[]
}) {
  const map = MAPS[destination]
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl bg-muted shadow-2xl ring-4 ring-border">
        <img src={map.src || '/placeholder.svg'} alt={map.alt} className="size-full object-cover" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-background/25" />
        {explorers.map((e) => {
          if (e.lat === undefined || e.lon === undefined) return null
          const pos = toMapPosition(e.lat, e.lon)
          const left = LABEL_LEFT.has(e.id) || pos.left > 70
          const done = remembered.includes(e.id)
          const alive = e.status !== 'silent'
          return (
            <Link
              key={e.id}
              href={`/stories/${e.id}`}
              onClick={() => sfx.whoosh()}
              aria-label={`${e.name}, ${e.site}. ${STATUS_LABEL[e.status]}.${done ? ' Remembered.' : ''} Read its story`}
              className={cn(
                'group absolute flex -translate-y-1/2 items-center gap-2 rounded-full',
                left ? 'flex-row-reverse -translate-x-[calc(100%-1rem)]' : '-translate-x-4',
              )}
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            >
              <span className="relative flex size-8 shrink-0 items-center justify-center">
                <span
                  aria-hidden="true"
                  className={cn('beacon absolute inset-0 rounded-full', alive ? 'bg-secondary' : 'bg-paper')}
                />
                <span
                  className={cn(
                    'relative flex size-5 items-center justify-center rounded-full ring-2 ring-background transition group-hover:scale-125',
                    done ? 'bg-accent text-accent-foreground' : alive ? 'bg-secondary' : 'bg-paper',
                  )}
                >
                  {done && <Check className="size-3.5" strokeWidth={4} aria-hidden="true" />}
                </span>
              </span>
              <span className="hidden rounded-full bg-background/85 px-3 py-1 text-sm font-bold whitespace-nowrap shadow-lg ring-2 ring-border backdrop-blur transition group-hover:bg-card group-focus-visible:bg-card sm:block">
                {e.name}
              </span>
            </Link>
          )
        })}
      </div>
      <figcaption className="text-xs text-muted-foreground">
        <a href={map.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {map.credit}
        </a>
        {'. Pins are placed by real landing-site latitude and longitude.'}
      </figcaption>
    </figure>
  )
}
