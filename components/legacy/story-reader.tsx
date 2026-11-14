'use client'

import { ArrowLeft, ArrowRight, Check, ExternalLink, Pause, Sparkles, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RoverAvatar } from '@/components/rover-avatar'
import { SoundSettingsButton } from '@/components/sound-settings'
import { sfx, speak, stopVoice, useVoiceState } from '@/lib/audio'
import { EXPLORERS, getExplorer } from '@/lib/legacy/explorers'
import { markRemembered, useMemory } from '@/lib/legacy/memory'
import { useHydrated } from '@/lib/local-store'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'

export function StoryReader({ id }: { id: string }) {
  const explorer = getExplorer(id)!
  const { chapters, voice } = explorer
  const [index, setIndex] = useState(0)
  const [narrate, setNarrate] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const voiceState = useVoiceState()
  const hydrated = useHydrated()
  const memory = useMemory()
  const alreadyRemembered = hydrated && memory.remembered.includes(explorer.id)

  useEffect(() => () => stopVoice(), [])

  const onQuestion = index === chapters.length
  const chapter = chapters[Math.min(index, chapters.length - 1)]
  const photo = (onQuestion ? undefined : chapter.photo) ?? explorer.photo
  const talking = voiceState.status === 'speaking'

  const goTo = (next: number) => {
    sfx.click()
    setIndex(next)
    if (next < chapters.length && narrate) speak({ text: chapters[next].text }, voice)
    else stopVoice()
  }

  const toggleVoice = () => {
    if (talking) {
      stopVoice()
      setNarrate(false)
      return
    }
    setNarrate(true)
    const text = onQuestion ? explorer.question.prompt : chapter.text
    speak({ text }, voice)
  }

  const answer = (i: number) => {
    if (picked === explorer.question.answerIndex) return
    setPicked(i)
    if (i === explorer.question.answerIndex) {
      sfx.fanfare()
      markRemembered(explorer.id)
      if (narrate) speak({ text: `Yes! ${explorer.question.explain} Thank you for remembering me.` }, voice)
    } else {
      sfx.gentle()
    }
  }

  const position = EXPLORERS.indexOf(explorer)
  const nextExplorer = EXPLORERS[(position + 1) % EXPLORERS.length]
  const correct = picked === explorer.question.answerIndex

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          href={`/stories?at=${explorer.destination}`}
          onClick={() => sfx.click()}
          className="flex h-14 items-center gap-2 rounded-full bg-card px-5 font-bold shadow-lg ring-2 ring-border transition hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          All explorers
        </Link>
        <SoundSettingsButton />
      </header>

      <div className="grid flex-1 items-start gap-6 lg:grid-cols-2 lg:gap-10">
        <figure className="flex flex-col gap-2 lg:sticky lg:top-6">
          <div className="-rotate-1 overflow-hidden rounded-3xl bg-paper p-3 shadow-2xl">
            <img
              key={photo.src}
              src={photo.src || '/placeholder.svg'}
              alt={photo.alt}
              className="animate-pop aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>
          <figcaption className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <span>{`Image: ${photo.credit}`}</span>
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Source
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>

        <section className="flex flex-col gap-5" aria-labelledby="story-title">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={explorer.status} />
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold tracking-wide uppercase ring-2 ring-border">
                {`${explorer.kind} · ${explorer.site}`}
              </span>
            </div>
            <h1 id="story-title" className="text-5xl leading-none font-bold text-balance md:text-6xl">
              {explorer.name}
            </h1>
          </div>

          <div className="flex items-end gap-3">
            <RoverAvatar
              accent={explorer.status === 'silent' ? 'primary' : 'secondary'}
              talking={talking}
              className="size-16 shrink-0"
            />
            <div
              aria-live="polite"
              className="relative flex min-h-48 flex-1 flex-col gap-3 rounded-3xl rounded-bl-md bg-paper p-5 text-paper-foreground shadow-xl"
            >
              {onQuestion ? (
                <>
                  <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary uppercase">
                    <Sparkles className="size-4" aria-hidden="true" />
                    Memory spark
                  </p>
                  <p className="text-xl leading-relaxed font-bold text-pretty">{explorer.question.prompt}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold tracking-wide text-primary uppercase">
                    {`Chapter ${index + 1} of ${chapters.length}`}
                  </p>
                  <h2 className="text-2xl font-bold text-balance">{chapter.title}</h2>
                  <p key={index} className="animate-rise text-lg leading-relaxed text-pretty">
                    {chapter.text}
                  </p>
                </>
              )}
            </div>
          </div>

          {onQuestion && (
            <div className="flex flex-col gap-3">
              <ul className="flex flex-col gap-3">
                {explorer.question.options.map((option, i) => {
                  const isPicked = picked === i
                  const isAnswer = i === explorer.question.answerIndex
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => answer(i)}
                        aria-pressed={isPicked}
                        disabled={correct && !isAnswer}
                        className={cn(
                          'flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left text-lg font-bold ring-2 transition',
                          isPicked && isAnswer
                            ? 'bg-secondary text-secondary-foreground ring-secondary'
                            : isPicked
                              ? 'bg-muted text-muted-foreground ring-border'
                              : 'bg-card ring-border hover:-translate-y-0.5 hover:ring-accent disabled:opacity-50',
                        )}
                      >
                        {option}
                        {isPicked && isAnswer && <Check className="size-6" strokeWidth={3} aria-hidden="true" />}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {picked !== null && (
                <p role="status" className="rounded-2xl bg-card p-4 leading-relaxed ring-2 ring-border">
                  {correct ? `Yes! ${explorer.question.explain}` : 'Not quite. Think back to the story and try again!'}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleVoice}
              className="flex h-14 items-center gap-2 rounded-full bg-card px-5 font-bold ring-2 ring-border transition hover:bg-muted"
            >
              {talking ? <Pause className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
              {talking ? 'Stop' : narrate ? 'Hear again' : 'Hear my story'}
            </button>
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                className="flex size-14 items-center justify-center rounded-full bg-card ring-2 ring-border transition hover:bg-muted disabled:opacity-40"
              >
                <ArrowLeft className="size-6" aria-hidden="true" />
                <span className="sr-only">Previous chapter</span>
              </button>
              {!onQuestion && (
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  className="flex h-14 items-center gap-2 rounded-full bg-primary px-6 text-lg font-bold text-primary-foreground shadow-[0_6px_0_0_#a8441a] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {index === chapters.length - 1 ? 'Memory spark' : 'Next'}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ol className="flex gap-2" aria-label="Story progress">
            {[...chapters, null].map((c, i) => (
              <li key={c?.title ?? 'question'} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === index ? 'step' : undefined}
                  className={cn(
                    'h-3 w-full rounded-full transition',
                    i === index ? 'bg-accent' : i < index ? 'bg-primary' : 'bg-muted hover:bg-border',
                  )}
                >
                  <span className="sr-only">{c ? `Chapter ${i + 1}: ${c.title}` : 'Memory spark question'}</span>
                </button>
              </li>
            ))}
          </ol>

          <dl className="grid grid-cols-3 gap-3 rounded-3xl bg-card p-4 ring-2 ring-border">
            {explorer.log.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{item.label}</dt>
                <dd className="font-bold text-balance">{item.value}</dd>
              </div>
            ))}
          </dl>

          {(correct || alreadyRemembered) && (
            <div className="animate-pop flex flex-col gap-3 rounded-3xl bg-accent p-5 text-accent-foreground sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold">{`${explorer.name} is remembered!`}</p>
              <Link
                href={`/stories/${nextExplorer.id}`}
                onClick={() => sfx.whoosh()}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-background px-5 font-bold text-foreground transition hover:-translate-y-0.5"
              >
                {`Meet ${nextExplorer.name}`}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {explorer.related && (
            <Link
              href={explorer.related.href}
              onClick={() => sfx.click()}
              className="self-start text-sm font-bold text-accent underline underline-offset-4"
            >
              {explorer.related.label}
            </Link>
          )}
        </section>
      </div>
    </main>
  )
}
