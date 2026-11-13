'use client'

import { ArrowRight, GraduationCap, X } from 'lucide-react'
import { RoverAvatar } from '@/components/rover-avatar'
import type { LevelData } from '@/lib/levels'
import { cn } from '@/lib/utils'

export type TutorialStep = 'select' | 'paint' | 'listen' | 'undo' | 'done'

export const TUTORIAL_ORDER: TutorialStep[] = ['select', 'paint', 'listen', 'undo', 'done']

export const TUTORIAL_TEXT: Record<TutorialStep, { title: string; text: string; next?: string }> = {
  select: {
    title: 'Tap a part of me',
    text: 'Let me show you how to play! First, tap any part of my picture. Try my wheels!',
  },
  paint: {
    title: 'Now pick a color',
    text: 'Great! Now tap a color. The glowing one with the star is my real color, but you can choose any color you like!',
  },
  listen: {
    title: 'Hear me again',
    text: 'Every time you tap a part, I tell you what it does. Tap the speaker button to hear me again.',
    next: 'Got it',
  },
  undo: {
    title: 'Oops button',
    text: 'Made a mistake? No problem! Tap Undo to go back one step.',
    next: 'Got it',
  },
  done: {
    title: "You're ready!",
    text: 'Awesome! Now color all my parts to finish the mission and play the quiz.',
    next: 'Start coloring!',
  },
}

export function TutorialCoach({
  level,
  step,
  onNext,
  onSkip,
}: {
  level: LevelData
  step: TutorialStep
  onNext: () => void
  onSkip: () => void
}) {
  const info = TUTORIAL_TEXT[step]
  const index = TUTORIAL_ORDER.indexOf(step)

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="tutorial-title"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3"
    >
      <div
        key={step}
        className="animate-pop pointer-events-auto flex w-full max-w-lg flex-col gap-3 rounded-3xl bg-paper p-4 text-paper-foreground shadow-2xl ring-4 ring-accent"
      >
        <div className="flex items-start gap-3">
          <RoverAvatar accent={level.accent} className="size-14 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase opacity-70">
              <GraduationCap className="size-4" aria-hidden="true" />
              Tutorial · Step {index + 1} of {TUTORIAL_ORDER.length}
            </p>
            <h2 id="tutorial-title" className="text-xl leading-tight font-bold">
              {info.title}
            </h2>
            <p className="leading-relaxed">{info.text}</p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-bold opacity-70 transition hover:bg-paper-foreground/10 hover:opacity-100"
          >
            Skip
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <ol className="flex gap-1.5" aria-label="Tutorial progress">
            {TUTORIAL_ORDER.map((s, i) => (
              <li
                key={s}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  i < index ? 'w-2.5 bg-accent' : i === index ? 'w-7 bg-accent' : 'w-2.5 bg-paper-foreground/20',
                )}
              >
                <span className="sr-only">
                  Step {i + 1}
                  {i < index ? ' done' : i === index ? ' current' : ''}
                </span>
              </li>
            ))}
          </ol>
          {info.next ? (
            <button
              type="button"
              onClick={onNext}
              className="flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-lg font-bold text-primary-foreground transition hover:-translate-y-0.5"
            >
              {info.next}
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <p className="text-sm font-bold opacity-70">Try it now!</p>
          )}
        </div>
      </div>
    </div>
  )
}
