'use client'

import { Info, Map, Play, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { PerseveranceArt } from '@/components/illustrations/perseverance-art'
import { sfx, speak, useVoiceState } from '@/lib/audio'
import { LEVELS } from '@/lib/levels'
import { useHydrated } from '@/lib/local-store'
import { getLevelProgress, isLevelUnlocked, useProgress } from '@/lib/progress'
import { RoverAvatar } from './rover-avatar'
import { SoundSettingsButton } from './sound-settings'

const MENU_FILLS: Record<string, string> = {
  sky: '#f4a66a',
  rim: '#c9733f',
  ground: '#d9482b',
  rock: '#9a5b3c',
  mmrtg: '#6d7585',
  hga: '#b7bfcc',
  mast: '#f3f1ea',
  supercam: '#f3f1ea',
  mastcamz: '#3a3f4f',
  deck: '#b7bfcc',
  body: '#f3f1ea',
  moxie: '#ffd23f',
  rimfax: '#6d7585',
  bogie: '#6d7585',
  rocker: '#6d7585',
  'wheel-rear': '#b7bfcc',
  'wheel-middle': '#b7bfcc',
  'wheel-front': '#b7bfcc',
  'arm-upper': '#f3f1ea',
  'arm-lower': '#f3f1ea',
  drill: '#6d7585',
  turret: '#b7bfcc',
  sherloc: '#2ec4b6',
  pixl: '#62b6f0',
}

const GREETING = {
  text: "Hi, space explorer! I'm Perseverance, a real NASA rover on Mars. Tap Play, and let's color and learn together!",
}

export function MainMenu() {
  const progress = useProgress()
  const hydrated = useHydrated()
  const voice = useVoiceState()
  const next =
    LEVELS.find((l) => isLevelUnlocked(progress, l.id) && !getLevelProgress(progress, l.id).completed) ??
    LEVELS[0]
  const allDone = hydrated && LEVELS.every((l) => getLevelProgress(progress, l.id).completed)
  const talking = voice.status === 'speaking' && voice.text === GREETING.text

  return (
    <main className="relative flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 p-4 md:p-6">
        <Link
          href="/credits"
          onClick={() => sfx.click()}
          className="flex h-14 items-center gap-2 rounded-full bg-card px-5 font-bold shadow-lg ring-2 ring-border transition hover:-translate-y-0.5 hover:bg-muted"
        >
          <Info className="size-5" aria-hidden="true" />
          Sources & credits
        </Link>
        <SoundSettingsButton />
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 pb-10 lg:flex-row lg:gap-12">
        <div className="flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="animate-rise rounded-full bg-card px-4 py-2 text-sm font-bold tracking-wide text-accent ring-2 ring-border">
            Color real Mars rovers · Learn real science
          </p>
          <h1
            className="animate-rise text-6xl leading-none font-bold text-balance md:text-8xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="block text-accent">NASA</span>
            <span className="block">Space Explorers</span>
          </h1>
          <p
            className="animate-rise max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            Color Perseverance and Curiosity, tap every part, and hear each rover explain how it explores Mars.
          </p>
          <div
            className="animate-rise flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href={`/levels/${next.id}`}
              onClick={() => sfx.whoosh()}
              className="flex h-20 items-center justify-center gap-3 rounded-full bg-primary px-10 text-3xl font-bold text-primary-foreground shadow-[0_8px_0_0_#a8441a] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Play className="size-8 fill-current" aria-hidden="true" />
              {allDone ? 'Play again' : 'Play'}
            </Link>
            <Link
              href="/levels"
              onClick={() => sfx.click()}
              className="flex h-20 items-center justify-center gap-3 rounded-full bg-card px-8 text-2xl font-bold shadow-lg ring-4 ring-border transition hover:-translate-y-1 hover:bg-muted"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Map className="size-7" aria-hidden="true" />
              Choose level
            </Link>
          </div>
          {hydrated && (
            <p className="text-sm font-semibold text-muted-foreground">
              {allDone
                ? 'You finished every level — amazing explorer!'
                : `Next up: Level ${next.order} — ${next.name}`}
            </p>
          )}
        </div>

        <div className="relative flex w-full max-w-xl flex-1 flex-col items-center gap-4">
          <div className="flex w-full items-end gap-3 self-start lg:-ml-6">
            <RoverAvatar accent="primary" talking={talking} className="size-20" />
            <button
              type="button"
              onClick={() => speak(GREETING, { pitch: 1.25, rate: 0.95 })}
              className="animate-pop relative flex-1 rounded-3xl rounded-bl-md bg-paper p-4 text-left text-paper-foreground shadow-xl transition hover:-translate-y-0.5"
            >
              <span className="block text-base leading-relaxed font-semibold md:text-lg">{GREETING.text}</span>
              <span className="mt-2 flex items-center gap-2 text-sm font-bold text-primary">
                <Volume2 className="size-4" aria-hidden="true" />
                Tap to hear me
              </span>
            </button>
          </div>
          <div className="animate-float w-full">
            <PerseveranceArt
              fills={MENU_FILLS}
              idPrefix="menu-"
              className="w-full drop-shadow-2xl [&>g:first-of-type]:opacity-0"
            />
          </div>
        </div>
      </section>

      <footer className="px-4 pb-6 text-center text-xs leading-relaxed text-muted-foreground">
        A fan-made educational game. Not affiliated with, sponsored or endorsed by NASA. Rover facts from
        science.nasa.gov.
      </footer>
    </main>
  )
}
