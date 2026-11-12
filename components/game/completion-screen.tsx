'use client'

import { ArrowRight, Download, Paintbrush, Volume2 } from 'lucide-react'
import { useRef } from 'react'
import { ILLUSTRATIONS } from '@/components/illustrations'
import { RoverAvatar } from '@/components/rover-avatar'
import { sfx, speak, useVoiceState } from '@/lib/audio'
import { downloadSvgAsPng } from '@/lib/coloring'
import type { LevelData } from '@/lib/levels'
import type { Fills } from '@/lib/progress'

export function CompletionScreen({
  level,
  fills,
  onStartQuiz,
  onBack,
}: {
  level: LevelData
  fills: Fills
  onStartQuiz: () => void
  onBack: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const Art = ILLUSTRATIONS[level.id]
  const voice = useVoiceState()
  const talking = voice.status === 'speaking' && voice.text === level.completion.text

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <div className="flex flex-col gap-4">
        <div className="animate-pop overflow-hidden rounded-[2rem] bg-paper p-2 shadow-2xl ring-4 ring-accent">
          <Art fills={fills} svgRef={svgRef} idPrefix="done-" className="w-full rounded-3xl" />
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.click()
            if (svgRef.current)
              void downloadSvgAsPng(
                svgRef.current,
                `${level.id}-coloring.png`,
                `My ${level.name} — NASA Space Explorers`,
              )
          }}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-card text-lg font-bold ring-2 ring-border transition hover:bg-muted"
        >
          <Download className="size-5" aria-hidden="true" />
          Save my picture
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <RoverAvatar accent={level.accent} talking={talking} className="size-20" />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl leading-tight font-bold text-balance md:text-5xl">Mission complete!</h1>
            <p className="text-lg leading-relaxed font-semibold">{level.completion.text}</p>
            <button
              type="button"
              onClick={() => speak(level.completion, level.voice)}
              className="flex items-center gap-2 self-start text-sm font-bold text-accent"
            >
              <Volume2 className="size-4" aria-hidden="true" />
              Hear it again
            </button>
          </div>
        </div>

        <section aria-labelledby="learned-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-5 ring-2 ring-border">
          <h2 id="learned-heading" className="text-2xl font-bold">
            What you learned
          </h2>
          <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {level.components.map((c) => (
              <li key={c.id} className="flex gap-3 leading-relaxed">
                <span className="mt-2 size-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>
                  <strong>{c.shortName}:</strong> {c.takeaway}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onStartQuiz}
            className="flex h-16 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-xl font-bold text-primary-foreground shadow-[0_6px_0_0_#a8441a] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            Start the quiz
            <ArrowRight className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex h-16 items-center justify-center gap-2 rounded-full bg-card px-6 text-lg font-bold ring-2 ring-border transition hover:bg-muted"
          >
            <Paintbrush className="size-5" aria-hidden="true" />
            Keep coloring
          </button>
        </div>
      </div>
    </div>
  )
}
