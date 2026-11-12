'use client'

import { ArrowRight, Camera, Check, Lightbulb, Map, RotateCcw, Search, Star, Volume2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { sfx, speak } from '@/lib/audio'
import { celebrate } from '@/lib/celebrate'
import { getNextLevel, type LevelData } from '@/lib/levels'
import { recordQuiz, type Fills } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { ILLUSTRATIONS } from '@/components/illustrations'
import { RoverAvatar } from '@/components/rover-avatar'

const LETTERS = ['A', 'B', 'C', 'D']

type Result = 'right' | 'wrong' | null
type ClueView = 'photo' | 'rover'

export function Quiz({
  level,
  fills,
  onReplayLevel,
}: {
  level: LevelData
  fills: Fills
  onReplayLevel: () => void
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<Result[]>(() => level.quiz.map(() => null))
  const [hintShown, setHintShown] = useState(false)
  const [view, setView] = useState<ClueView>('photo')
  const [finished, setFinished] = useState(false)

  const total = level.quiz.length
  const q = level.quiz[index]
  const next = getNextLevel(level.id)
  const score = results.filter((r) => r === 'right').length
  const passed = score >= level.passScore
  const Art = ILLUSTRATIONS[level.id]

  const highlighted = useMemo(
    () => new Set(level.regions.filter((r) => r.componentId === q.componentId).map((r) => r.id)),
    [level, q.componentId],
  )
  const partName = level.components.find((c) => c.id === q.componentId)?.name

  const feedback =
    picked === null
      ? null
      : picked === q.answerIndex
        ? `Great job! ${q.explanation}`
        : `Nice try! The answer is "${q.options[q.answerIndex]}". ${q.explanation}`

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const correct = i === q.answerIndex
    setResults((prev) => prev.map((r, idx) => (idx === index ? (correct ? 'right' : 'wrong') : r)))
    if (correct) sfx.correct()
    else sfx.gentle()
    // After answering, show where the part lives on the child's own rover.
    if (q.componentId) setView('rover')
    speak(
      {
        text: correct
          ? `Great job! ${q.explanation}`
          : `Nice try! The answer is ${q.options[q.answerIndex]}. ${q.explanation}`,
      },
      level.voice,
    )
  }

  const showHint = () => {
    sfx.click()
    setHintShown(true)
    speak({ text: q.hint }, level.voice)
  }

  const goTo = (i: number) => {
    setIndex(i)
    setPicked(null)
    setHintShown(false)
    setView('photo')
  }

  const advance = () => {
    sfx.click()
    if (index + 1 < total) {
      goTo(index + 1)
      speak({ text: level.quiz[index + 1].question }, level.voice)
      return
    }
    const didPass = score >= level.passScore
    recordQuiz(level.id, score, total, didPass)
    setFinished(true)
    if (didPass) {
      sfx.fanfare()
      celebrate()
      speak(
        {
          text: `You got ${score} out of ${total}! ${
            next ? `You unlocked ${next.name}!` : 'You finished every rover. You are a true space explorer!'
          }`,
        },
        level.voice,
      )
    } else {
      speak(
        { text: `You got ${score} out of ${total}. Great effort! Let's try again together. You can do it!` },
        level.voice,
      )
    }
  }

  const retry = () => {
    sfx.click()
    setResults(level.quiz.map(() => null))
    setFinished(false)
    goTo(0)
    speak({ text: level.quiz[0].question }, level.voice)
  }

  if (finished) {
    return (
      <div className="animate-pop flex flex-col items-center gap-5 text-center">
        <RoverAvatar accent={level.accent} className="size-24" />
        <h2 className="text-4xl font-bold text-balance">{passed ? 'Quiz complete!' : 'Great effort!'}</h2>
        <p className="flex gap-1" aria-label={`${score} out of ${total} stars`}>
          {results.map((r, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn('size-10', r === 'right' ? 'fill-accent text-accent' : 'text-border')}
            />
          ))}
        </p>
        <p className="text-xl leading-relaxed font-semibold">
          You got {score} out of {total} right.
        </p>

        <ul className="grid w-full max-w-2xl grid-cols-2 gap-3 text-left sm:grid-cols-3 md:grid-cols-5">
          {level.quiz.map((item, i) => (
            <li key={item.id} className="flex flex-col overflow-hidden rounded-2xl bg-background ring-2 ring-border">
              <div className="relative aspect-[4/3]">
                <Image src={item.image.src} alt="" fill sizes="160px" className="object-cover" />
                <span
                  className={cn(
                    'absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full',
                    results[i] === 'right' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground',
                  )}
                >
                  {results[i] === 'right' ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <RotateCcw className="size-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">{results[i] === 'right' ? 'Correct' : 'Try again'}</span>
                </span>
              </div>
              <p className="p-2 text-sm leading-snug font-semibold">{item.options[item.answerIndex]}</p>
            </li>
          ))}
        </ul>

        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          {passed
            ? next
              ? `${next.name} is now unlocked. Ready for Level ${next.order}?`
              : 'You finished every rover. You are a true space explorer!'
            : `Get ${level.passScore} right to unlock the next rover. Every explorer practices — let's try again!`}
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {passed && next && (
            <Link
              href={`/levels/${next.id}`}
              onClick={() => sfx.whoosh()}
              className="flex h-16 items-center justify-center gap-2 rounded-full bg-primary px-8 text-xl font-bold text-primary-foreground transition hover:-translate-y-0.5"
            >
              Play Level {next.order}: {next.name}
              <ArrowRight className="size-6" aria-hidden="true" />
            </Link>
          )}
          {passed && !next && (
            <Link
              href="/levels"
              onClick={() => sfx.click()}
              className="flex h-16 items-center justify-center gap-2 rounded-full bg-primary px-8 text-xl font-bold text-primary-foreground transition hover:-translate-y-0.5"
            >
              <Map className="size-6" aria-hidden="true" />
              All levels
            </Link>
          )}
          <button
            type="button"
            onClick={retry}
            className={cn(
              'flex h-16 items-center justify-center gap-2 rounded-full px-8 text-xl font-bold transition hover:-translate-y-0.5',
              passed ? 'bg-card ring-2 ring-border' : 'bg-primary text-primary-foreground',
            )}
          >
            <RotateCcw className="size-6" aria-hidden="true" />
            Try the quiz again
          </button>
          <button
            type="button"
            onClick={onReplayLevel}
            className="flex h-16 items-center justify-center gap-2 rounded-full bg-card px-8 text-xl font-bold ring-2 ring-border transition hover:-translate-y-0.5"
          >
            Back to coloring
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <ol className="flex items-center gap-2" aria-label={`Question ${index + 1} of ${total}`}>
          {results.map((r, i) => (
            <li
              key={i}
              aria-hidden="true"
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-sm font-bold ring-2 transition',
                i === index && 'scale-110 bg-accent text-accent-foreground ring-accent',
                i !== index && r === 'right' && 'bg-secondary text-secondary-foreground ring-secondary',
                i !== index && r === 'wrong' && 'bg-muted ring-primary',
                i !== index && r === null && 'bg-background text-muted-foreground ring-border',
              )}
            >
              {r === 'right' && i !== index ? <Check className="size-4" /> : i + 1}
            </li>
          ))}
        </ol>
        <p className="flex items-center gap-1 text-lg font-bold" aria-label={`Score: ${score}`}>
          <Star className="size-6 fill-accent text-accent" aria-hidden="true" />
          {score}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Picture clue */}
        <figure key={q.id} className="animate-pop flex flex-col gap-2">
          {q.componentId && (
            <div role="tablist" aria-label="Picture clue" className="flex gap-1 rounded-full bg-background p-1">
              <ClueTab active={view === 'photo'} onClick={() => setView('photo')} icon={Camera}>
                NASA photo
              </ClueTab>
              <ClueTab active={view === 'rover'} onClick={() => setView('rover')} icon={Search}>
                Find it on my rover
              </ClueTab>
            </div>
          )}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-paper ring-4 ring-border">
            {view === 'rover' && q.componentId ? (
              <Art
                fills={fills}
                highlighted={highlighted}
                idPrefix="quiz-"
                className="size-full"
              />
            ) : (
              <Image
                src={q.image.src}
                alt={q.image.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                priority={index === 0}
              />
            )}
          </div>
          <figcaption className="text-sm leading-snug text-muted-foreground">
            {view === 'rover' && partName ? (
              <>
                The glowing part is <strong className="text-foreground">{partName}</strong>.
              </>
            ) : (
              <>
                {q.image.alt}.{' '}
                <a
                  href={q.image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Image: {q.image.credit}
                </a>
              </>
            )}
          </figcaption>
        </figure>

        {/* Question */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <h2 className="flex-1 text-2xl leading-tight font-bold text-balance md:text-3xl">{q.question}</h2>
            <button
              type="button"
              onClick={() => speak({ text: feedback ?? q.question }, level.voice)}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-border transition hover:bg-muted"
            >
              <Volume2 className="size-6" aria-hidden="true" />
              <span className="sr-only">Read out loud</span>
            </button>
          </div>

          <ul className="grid gap-3">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answerIndex
              const isPicked = i === picked
              const revealed = picked !== null
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    disabled={revealed}
                    className={cn(
                      'flex min-h-14 w-full items-center gap-3 rounded-2xl p-3 text-left text-lg font-bold ring-4 transition',
                      !revealed && 'bg-background ring-border hover:-translate-y-0.5 hover:bg-muted',
                      revealed && isAnswer && 'bg-secondary text-secondary-foreground ring-secondary',
                      revealed && isPicked && !isAnswer && 'bg-muted ring-primary',
                      revealed && !isAnswer && !isPicked && 'bg-background opacity-60 ring-border',
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-foreground">
                      {revealed && isAnswer ? (
                        <Check className="size-5" aria-hidden="true" />
                      ) : revealed && isPicked ? (
                        <X className="size-5" aria-hidden="true" />
                      ) : (
                        LETTERS[i]
                      )}
                    </span>
                    {opt}
                  </button>
                </li>
              )
            })}
          </ul>

          {picked === null &&
            (hintShown ? (
              <p
                aria-live="polite"
                className="animate-pop flex items-start gap-2 rounded-2xl bg-background p-3 text-base leading-relaxed ring-2 ring-accent"
              >
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                {q.hint}
              </p>
            ) : (
              <button
                type="button"
                onClick={showHint}
                className="flex h-12 items-center justify-center gap-2 self-start rounded-full bg-background px-5 font-bold text-accent ring-2 ring-accent/60 transition hover:-translate-y-0.5"
              >
                <Lightbulb className="size-5" aria-hidden="true" />
                Need a hint?
              </button>
            ))}
        </div>
      </div>

      {feedback && (
        <div className="animate-pop flex flex-col gap-4 rounded-3xl bg-paper p-4 text-paper-foreground sm:flex-row sm:items-center">
          <RoverAvatar accent={level.accent} className="size-14" />
          <p aria-live="polite" className="flex-1 text-lg leading-relaxed font-semibold">
            {feedback}
          </p>
          <button
            type="button"
            onClick={advance}
            className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-bold text-primary-foreground transition hover:-translate-y-0.5"
          >
            {index + 1 < total ? 'Next question' : 'See my score'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

function ClueTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Camera
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => {
        sfx.click()
        onClick()
      }}
      className={cn(
        'flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-bold transition',
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </button>
  )
}
