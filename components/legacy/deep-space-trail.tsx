'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { sfx } from '@/lib/audio'
import type { Explorer } from '@/lib/legacy/explorers'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'

const PLANETS = [
  { name: 'Sun', size: 'size-10', color: 'bg-accent' },
  { name: 'Earth', size: 'size-3', color: 'bg-secondary' },
  { name: 'Jupiter', size: 'size-7', color: 'bg-primary' },
  { name: 'Saturn', size: 'size-6', color: 'bg-accent' },
  { name: 'Uranus', size: 'size-5', color: 'bg-secondary' },
  { name: 'Neptune', size: 'size-5', color: 'bg-secondary' },
  { name: 'Pluto', size: 'size-2', color: 'bg-muted-foreground' },
]

const ZONES = [
  {
    id: 'beyond-pluto',
    title: 'Far beyond Pluto',
    note: 'We can no longer hear the Pioneers, so their exact spot is calculated, not measured.',
    ids: ['pioneer-11', 'pioneer-10'],
  },
  {
    id: 'interstellar',
    title: 'Interstellar space',
    note: 'Outside the Sun’s bubble of solar wind. Only the Voyagers have been measured out here.',
    ids: ['voyager-2', 'voyager-1'],
  },
]

export function DeepSpaceTrail({ explorers, remembered }: { explorers: Explorer[]; remembered: string[] }) {
  const byId = new Map(explorers.map((e) => [e.id, e]))
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-card p-5 shadow-2xl ring-4 ring-border md:p-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-wide text-accent uppercase">The road out of the solar system</p>
        <ol className="flex items-center justify-between gap-2" aria-label="Planets the probes flew past">
          {PLANETS.map((p) => (
            <li key={p.name} className="flex flex-col items-center gap-2">
              <span aria-hidden="true" className={cn('rounded-full', p.size, p.color)} />
              <span className="text-xs font-semibold text-muted-foreground">{p.name}</span>
            </li>
          ))}
          <li aria-hidden="true" className="h-1 flex-1 rounded-full border-t-4 border-dashed border-border" />
        </ol>
        <p className="text-xs leading-relaxed text-muted-foreground">Not to scale. The real distances are far too big to fit!</p>
      </div>

      <p className="rounded-2xl bg-paper p-4 leading-relaxed font-semibold text-paper-foreground">
        {'This week: on November 18, 2026, Voyager 1 becomes the first human-made object one light-day from Earth. A radio message sent today reaches it tomorrow.'}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {ZONES.map((zone) => (
          <section key={zone.id} className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
            <h3 className="text-2xl font-bold">{zone.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{zone.note}</p>
            <ul className="flex flex-col gap-3">
              {zone.ids.map((id) => {
                const e = byId.get(id)
                if (!e) return null
                const done = remembered.includes(e.id)
                return (
                  <li key={e.id}>
                    <Link
                      href={`/stories/${e.id}`}
                      onClick={() => sfx.whoosh()}
                      className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-2 ring-border transition hover:-translate-y-0.5 hover:ring-accent"
                    >
                      <img
                        src={e.photo.src || '/placeholder.svg'}
                        alt=""
                        className="size-16 shrink-0 rounded-xl object-cover"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="flex items-center gap-2 text-lg font-bold">
                          {e.name}
                          {done && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                              <Check className="size-3.5" strokeWidth={4} aria-hidden="true" />
                              <span className="sr-only">Remembered</span>
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">{e.whereNow}</span>
                        <StatusBadge status={e.status} className="self-start" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
