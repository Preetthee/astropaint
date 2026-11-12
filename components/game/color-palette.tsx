'use client'

import { Lightbulb, Pipette, Sparkles } from 'lucide-react'
import { PALETTE } from '@/lib/coloring'
import { cn } from '@/lib/utils'

export interface ColorSuggestion {
  hex: string
  partLabel: string
}

export function ColorPalette({
  color,
  onChange,
  active,
  suggestion,
}: {
  color: string
  onChange: (hex: string) => void
  active: boolean
  suggestion?: ColorSuggestion | null
}) {
  const isCustom = !PALETTE.some((p) => p.hex === color)
  const suggestedName = suggestion ? PALETTE.find((p) => p.hex === suggestion.hex)?.name : undefined
  const usingSuggestion = active && suggestion?.hex === color

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Choose a color</legend>

      {suggestion && suggestedName && (
        <div
          aria-live="polite"
          className="flex items-center gap-2 rounded-2xl bg-muted p-2 lg:flex-col lg:items-stretch"
        >
          <p className="flex flex-1 items-start gap-1.5 text-sm leading-snug">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Real <strong>{suggestion.partLabel}</strong> looks{' '}
              <strong className="whitespace-nowrap">{suggestedName}</strong>
            </span>
          </p>
          <button
            type="button"
            onClick={() => onChange(suggestion.hex)}
            disabled={usingSuggestion}
            className={cn(
              'flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-bold transition',
              usingSuggestion
                ? 'bg-card text-muted-foreground'
                : 'bg-accent text-accent-foreground hover:-translate-y-0.5',
            )}
          >
            <span
              aria-hidden="true"
              className="size-4 rounded-full ring-2 ring-background"
              style={{ backgroundColor: suggestion.hex }}
            />
            {usingSuggestion ? 'Selected' : 'Try it'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-9 gap-1.5 sm:gap-2 lg:grid-cols-3">
        {PALETTE.map((p) => {
          const selected = active && color === p.hex
          const recommended = suggestion?.hex === p.hex
          return (
            <button
              key={p.hex}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(p.hex)}
              className={cn(
                'relative aspect-square w-full rounded-full ring-2 ring-background transition hover:scale-110',
                recommended && !selected && 'suggest-ring',
                selected && 'scale-110 ring-4 ring-accent',
              )}
              style={{ backgroundColor: p.hex }}
            >
              {recommended && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-accent-foreground sm:size-5"
                >
                  <Sparkles className="size-2.5 sm:size-3" />
                </span>
              )}
              <span className="sr-only">
                {p.name}
                {recommended ? ' (suggested)' : ''}
              </span>
            </button>
          )
        })}
        <label
          className={cn(
            'relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-full bg-card ring-2 ring-border transition hover:scale-110',
            active && isCustom && 'scale-110 ring-4 ring-accent',
          )}
          style={isCustom ? { backgroundColor: color } : undefined}
        >
          <Pipette
            className={cn('size-4 sm:size-5', isCustom ? 'text-paper-foreground' : 'text-foreground')}
            aria-hidden="true"
          />
          <span className="sr-only">Mix your own color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </fieldset>
  )
}
