'use client'

import { ArrowLeft, CheckCircle2, Globe2, Lock, Moon, Play, Rocket, RotateCcw, Star } from 'lucide-react'
import Link from 'next/link'
import { sfx } from '@/lib/audio'
import { LEVELS, type LevelData } from '@/lib/levels'
import { UPCOMING_LEVELS, type UpcomingLevel } from '@/lib/levels/upcoming'
import { useHydrated } from '@/lib/local-store'
import { getLevelProgress, isLevelUnlocked, useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { RealPhotoButton } from './real-photo'
import { SoundSettingsButton } from './sound-settings'

function LevelCard({ level }: { level: LevelData }) {
  const progress = useProgress()
  const hydrated = useHydrated()
  const unlocked = !hydrated ? level.order === 1 : isLevelUnlocked(progress, level.id)
  const lp = getLevelProgress(progress, level.id)
  const started = hydrated && Object.keys(progress.artwork[level.id] ?? {}).length > 0
  const prev = LEVELS.find((l) => l.order === level.order - 1)

  return (
    <article
      className={cn(
        'animate-rise flex flex-col overflow-hidden rounded-[2rem] bg-card ring-4 shadow-2xl',
        lp.completed ? 'ring-secondary' : 'ring-border',
      )}
      style={{ animationDelay: `${level.order * 100}ms` }}
    >
      <figure className="relative">
        <img
          src={level.photo.src || '/placeholder.svg'}
          alt={level.photo.alt}
          className={cn('aspect-[16/10] w-full object-cover', !unlocked && 'grayscale brightness-50')}
        />
        <figcaption className="absolute right-2 bottom-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
          Real photo: {level.photo.credit}
        </figcaption>
        <span
          className={cn(
            'absolute top-3 left-3 rounded-full px-4 py-2 text-lg font-bold',
            level.accent === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Level {level.order}
        </span>
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-background/90 ring-4 ring-border">
              <Lock className="size-10 text-accent" aria-hidden="true" />
            </span>
            <span className="rounded-full bg-background/90 px-4 py-2 font-bold">
              Finish {prev?.name} to unlock
            </span>
          </div>
        )}
        {lp.completed && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-secondary px-3 py-2 font-bold text-secondary-foreground">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            Completed
          </span>
        )}
      </figure>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-wide text-accent uppercase">{level.mission} mission</p>
          <h2 className="text-3xl font-bold text-balance">{level.title}</h2>
          <p className="leading-relaxed text-muted-foreground">{level.description}</p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          {level.facts.map((f) => (
            <div key={f.label} className="flex flex-col rounded-2xl bg-muted p-3">
              <dt className="text-xs font-bold text-muted-foreground uppercase">{f.label}</dt>
              <dd className="font-bold leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
        {hydrated && lp.total > 0 && (
          <p className="flex items-center gap-2 font-bold">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: lp.total }, (_, i) => (
                <Star
                  key={i}
                  className={cn('size-5', i < lp.bestScore ? 'fill-accent text-accent' : 'text-border')}
                />
              ))}
            </span>
            Best quiz score: {lp.bestScore} of {lp.total}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <RealPhotoButton level={level} />
          {unlocked ? (
            <Link
              href={`/levels/${level.id}`}
              onClick={() => sfx.whoosh()}
              className={cn(
                'flex h-16 items-center justify-center gap-3 rounded-full text-2xl font-bold transition hover:-translate-y-0.5',
                level.accent === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {lp.completed ? (
                <RotateCcw className="size-6" aria-hidden="true" />
              ) : (
                <Play className="size-6 fill-current" aria-hidden="true" />
              )}
              {lp.completed ? 'Play again' : started ? 'Continue' : 'Start'}
              <span className="sr-only"> {level.title}</span>
            </Link>
          ) : (
            <p className="flex h-16 items-center justify-center gap-2 rounded-full bg-muted text-lg font-bold text-muted-foreground">
              <Lock className="size-5" aria-hidden="true" />
              Locked
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

function ComingSoonCard({ level, delay }: { level: UpcomingLevel; delay: number }) {
  return (
    <li
      className="animate-rise flex flex-col overflow-hidden rounded-3xl bg-card ring-2 ring-border"
      style={{ animationDelay: `${delay}ms` }}
    >
      <figure className="relative">
        <img
          src={level.photo.src || '/placeholder.svg'}
          alt={level.photo.alt}
          className="aspect-[4/3] w-full object-cover opacity-70 grayscale-[60%]"
        />
        <span className="absolute top-2 left-2 rounded-full bg-background/90 px-3 py-1 text-sm font-bold">
          Level {level.order}
        </span>
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
          {level.destination === 'Moon' ? (
            <Moon className="size-4" aria-hidden="true" />
          ) : (
            <Globe2 className="size-4" aria-hidden="true" />
          )}
          {level.destination}
        </span>
        <figcaption className="absolute right-2 bottom-2 max-w-[90%] truncate rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold">
          {level.photo.credit}
        </figcaption>
      </figure>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-xl font-bold text-balance">{level.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{level.teaser}</p>
        <dl className="grid grid-cols-3 gap-1.5">
          {level.facts.map((f) => (
            <div key={f.label} className="flex flex-col rounded-xl bg-muted p-2">
              <dt className="text-[11px] font-bold text-muted-foreground uppercase">{f.label}</dt>
              <dd className="text-sm leading-snug font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto flex h-11 items-center justify-center gap-2 rounded-full bg-muted text-sm font-bold text-muted-foreground">
          <Lock className="size-4" aria-hidden="true" />
          Coming soon
        </p>
      </div>
    </li>
  )
}

export function LevelSelector() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => sfx.click()}
          className="flex h-14 items-center gap-2 rounded-full bg-card px-5 font-bold shadow-lg ring-2 ring-border transition hover:-translate-y-0.5 hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Menu
        </Link>
        <SoundSettingsButton />
      </header>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-5xl font-bold text-balance md:text-6xl">Choose your rover</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Finish a level and pass its quiz to unlock the next rover.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {LEVELS.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>

      <section aria-labelledby="coming-soon" className="flex flex-col gap-4 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="coming-soon" className="flex items-center gap-2 text-3xl font-bold">
            <Rocket className="size-7 text-accent" aria-hidden="true" />
            Coming soon
          </h2>
          <p className="text-muted-foreground">More NASA explorers are on their way!</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UPCOMING_LEVELS.map((u, i) => (
            <ComingSoonCard key={u.id} level={u} delay={(LEVELS.length + i + 1) * 100} />
          ))}
        </ul>
      </section>
    </main>
  )
}
