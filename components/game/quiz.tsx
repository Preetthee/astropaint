'use client'

import { ArrowRight, Check, Map, RotateCcw, Star, Volume2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { sfx, speak } from '@/lib/audio'
import { celebrate } from '@/lib/celebrate'
import { getNextLevel, type LevelData } from '@/lib/levels'
import { recordQuiz } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { RoverAvatar } from '@/components/rover-avatar'

const LETTERS = ['A', 'B', 'C', 'D']

export function Quiz({ level, onReplayLevel }: { level: LevelData; onReplayLevel: () => void }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const total = level.quiz.length
  const q = level.quiz[index]
  const next = getNextLevel(level.id)
  const passed = score >= level.passScore

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
    if (correct) {
      setScore((s) => s + 1)
      sfx.correct()
    } else {
      sfx.gentle()
    }
    speak(
      {
        text: correct
          ? `Great job! ${q.explanation}`
          : `Nice try! The answer is ${q.options[q.answerIndex]}. ${q.explanation}`,
      },
      level.voice,
    )
  }

  const advance = () => {
    sfx.click()
    if (index + 1 < total) {
      setIndex(index + 1)
      setPicked(null)
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
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    speak({ text: level.quiz[0].question }, level.voice)
  }

  if (finished) {
    return (
      <div className="animate-pop flex flex-col items-center gap-5 text-center">
        <RoverAvatar accent={level.accent} className="size-24" />
        <h2 className="text-4xl font-bold text-balance">{passed ? 'Quiz complete!' : 'Great effort!'}</h2>
        <p className="flex gap-1" aria-label={`${score} out of ${total} stars`}>
          {Array.from({ length: total }, (_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn('size-10', i < score ? 'fill-accent text-accent' : 'text-border')}
            />
          ))}
        </p>
        <p className="text-xl leading-relaxed font-semibold">
          You got {score} out of {total} right.
        </p>
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
        <p className="font-bold text-accent">
          Question {index + 1} of {total}
        </p>
        <p className="flex items-center gap-1 font-bold" aria-label={`Score: ${score}`}>
          <Star className="size-5 fill-accent text-accent" aria-hidden="true" />
          {score}
        </p>
      </div>
      <div className="flex items-start gap-3">
        <h2 className="flex-1 text-3xl leading-tight font-bold text-balance">{q.question}</h2>
        <button
          type="button"
          onClick={() => speak({ text: feedback ?? q.question }, level.voice)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card ring-2 ring-border transition hover:bg-muted"
        >
          <Volume2 className="size-6" aria-hidden="true" />
          <span className="sr-only">Read out loud</span>
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
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
                  'flex min-h-16 w-full items-center gap-3 rounded-2xl p-4 text-left text-lg font-bold ring-4 transition',
                  !revealed && 'bg-card ring-border hover:-translate-y-0.5 hover:bg-muted',
                  revealed && isAnswer && 'bg-secondary text-secondary-foreground ring-secondary',
                  revealed && isPicked && !isAnswer && 'bg-muted ring-primary',
                  revealed && !isAnswer && !isPicked && 'bg-card opacity-60 ring-border',
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
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
