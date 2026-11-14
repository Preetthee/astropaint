'use client'

import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { SoundSettingsButton } from '@/components/sound-settings'
import { sfx } from '@/lib/audio'
import { DESTINATIONS, EXPLORERS, explorersAt, type Destination } from '@/lib/legacy/explorers'
import { useMemory } from '@/lib/legacy/memory'
import { useHydrated } from '@/lib/local-store'
import { cn } from '@/lib/utils'
import { DeepSpaceTrail } from './deep-space-trail'
import { PlanetMap } from './planet-map'
import { StatusBadge } from './status-badge'

export function LegacyHub({ destination }: { destination: Destination }) {
  const hydrated = useHydrated()
  const memory = useMemory()
  const remembered = hydrated ? memory.remembered : []
  const here = explorersAt(destination)
  const current = DESTINATIONS.find((d) => d.id === destination) ?? DESTINATIONS[0]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => sfx.click()}
          className="flex h-14 items-center gap-2 rounded-full bg-card px-5 font-bold shadow-lg ring-2 ring-border transition hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Menu
        </Link>
        <SoundSettingsButton />
      </header>

      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="animate-rise self-start rounded-full bg-card px-4 py-2 text-sm font-bold tracking-wide text-accent ring-2 ring-border">
            Abandoned, but not forgotten
          </p>
          <h1 className="animate-rise text-5xl leading-none font-bold text-balance md:text-7xl" style={{ animationDelay: '80ms' }}>
            The Silent Explorers
          </h1>
          <p className="animate-rise text-lg leading-relaxed text-pretty text-muted-foreground" style={{ animationDelay: '160ms' }}>
            NASA has left landers, rovers and probes all over the solar system. Their missions are over, but their
            stories are not. Tap a glowing beacon and let each machine tell you what it discovered.
          </p>
        </div>
        <div
          className="animate-rise flex flex-col gap-2 rounded-3xl bg-card p-4 ring-2 ring-border md:min-w-64"
          style={{ animationDelay: '240ms' }}
        >
          <p className="font-bold">
            {`You remember ${remembered.length} of ${EXPLORERS.length} explorers`}
          </p>
          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Explorers remembered"
            aria-valuemin={0}
            aria-valuemax={EXPLORERS.length}
            aria-valuenow={remembered.length}
          >
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${(remembered.length / EXPLORERS.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Finish a story and answer its memory question.</p>
        </div>
      </section>

      <nav aria-label="Destinations" className="flex flex-wrap gap-3">
        {DESTINATIONS.map((d) => {
          const active = d.id === destination
          const count = explorersAt(d.id).filter((e) => remembered.includes(e.id)).length
          return (
            <Link
              key={d.id}
              href={`/stories?at=${d.id}`}
              replace
              scroll={false}
              onClick={() => sfx.click()}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-14 items-center gap-3 rounded-full px-6 text-lg font-bold ring-2 transition',
                active
                  ? 'bg-primary text-primary-foreground ring-primary'
                  : 'bg-card ring-border hover:bg-muted',
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {d.name}
              <span
                className={cn(
                  'rounded-full px-2 text-sm',
                  active ? 'bg-primary-foreground/15' : 'bg-muted text-muted-foreground',
                )}
              >
                {`${count}/${explorersAt(d.id).length}`}
              </span>
            </Link>
          )
        })}
      </nav>

      <section aria-labelledby="dest-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="dest-title" className="text-3xl font-bold">
            {current.name}
          </h2>
          <p className="leading-relaxed text-muted-foreground">{current.blurb}</p>
        </div>

        {destination === 'deep' ? (
          <DeepSpaceTrail explorers={here} remembered={remembered} />
        ) : (
          <>
            <PlanetMap destination={destination} explorers={here} remembered={remembered} />
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-paper" /> Silent now
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-secondary" /> Still helping science
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-accent" /> You remember it
              </span>
            </div>
          </>
        )}
      </section>

      {destination !== 'deep' && (
        <section aria-label={`Explorers on ${current.name}`}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {here.map((e) => {
              const done = remembered.includes(e.id)
              return (
                <li key={e.id}>
                  <Link
                    href={`/stories/${e.id}`}
                    onClick={() => sfx.whoosh()}
                    className="flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-2 ring-border transition hover:-translate-y-1 hover:ring-accent"
                  >
                    <img src={e.photo.src || '/placeholder.svg'} alt="" className="aspect-[4/3] w-full object-cover" />
                    <span className="flex flex-1 flex-col gap-2 p-4">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                          {e.name}
                        </span>
                        {done && (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                            <Check className="size-4" strokeWidth={4} aria-hidden="true" />
                            <span className="sr-only">Remembered</span>
                          </span>
                        )}
                      </span>
                      <span className="text-sm leading-relaxed text-muted-foreground">{e.tagline}</span>
                      <StatusBadge status={e.status} className="mt-auto self-start" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <footer className="pb-4 text-center text-xs leading-relaxed text-muted-foreground">
        Facts checked against NASA mission pages. Photos courtesy of NASA — see{' '}
        <Link href="/credits" className="underline underline-offset-2">
          sources & credits
        </Link>
        .
      </footer>
    </main>
  )
}
