'use client'

import { Hand, Pipette, Star } from 'lucide-react'
import { PALETTE } from '@/lib/coloring'
import { cn } from '@/lib/utils'

export interface PaletteTarget {
  /** Label of the part that will be painted, e.g. "front wheel". */
  partLabel: string
  /** Color the part currently has, if any. */
  currentHex?: string
  /** Real-life color suggestion for this part. */
  suggestedHex?: string
}

export function ColorPalette({
  target,
  onPick,
  nudge,
}: {
  target: PaletteTarget | null
  onPick: (hex: string) => void
  /** Changes every time the child taps a color with no part selected. */
  nudge: number
}) {
  const suggestedName = target?.suggestedHex
    ? (PALETTE.find((p) => p.hex === target.suggestedHex)?.name ?? 'this color')
    : undefined
  const currentIsCustom = !!target?.currentHex && !PALETTE.some((p) => p.hex === target.currentHex)

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Choose a color</legend>

      {target ? (
        <div aria-live="polite" className="animate-pop flex flex-col gap-2" key={target.partLabel}>
          <p className="text-sm font-bold text-muted-foreground">
            Painting: <span className="text-foreground capitalize">{target.partLabel}</span>
          </p>
          {target.suggestedHex && (
            <button
              type="button"
              onClick={() => onPick(target.suggestedHex!)}
              className="suggest-card flex items-center gap-3 rounded-2xl bg-accent p-2.5 text-left text-accent-foreground transition hover:-translate-y-0.5"
            >
              <span
                aria-hidden="true"
                className="relative flex size-14 shrink-0 items-center justify-center rounded-full ring-4 ring-accent-foreground/80"
                style={{ backgroundColor: target.suggestedHex }}
              >
                <Star className="absolute -top-1.5 -right-1.5 size-6 fill-paper text-accent-foreground" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-xs font-bold uppercase opacity-90">Real rover color</span>
                <span className="text-xl leading-tight font-bold capitalize" style={{ fontFamily: 'var(--font-heading)' }}>
                  {suggestedName}
                </span>
                <span className="text-xs font-semibold opacity-90">Tap to use it</span>
              </span>
            </button>
          )}
          <p className="text-xs leading-snug text-muted-foreground">Or pick any color you like!</p>
        </div>
      ) : (
        <div
          key={nudge}
          aria-live="polite"
          className={cn(
            'flex items-center gap-3 rounded-2xl bg-muted p-3 ring-2 ring-border',
            nudge > 0 && 'animate-nudge ring-accent',
          )}
        >
          <Hand className="size-8 shrink-0 animate-bounce text-accent" aria-hidden="true" />
          <p className="text-base leading-snug font-bold">
            First, tap a part of the rover. Then pick a color!
          </p>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-9 gap-1.5 transition sm:gap-2 lg:grid-cols-3',
          !target && 'opacity-50',
        )}
      >
        {PALETTE.map((p) => {
          const current = target?.currentHex === p.hex
          const recommended = target?.suggestedHex === p.hex
          return (
            <button
              key={p.hex}
              type="button"
              aria-pressed={current}
              onClick={() => onPick(p.hex)}
              className={cn(
                'relative aspect-square w-full rounded-full ring-2 ring-background transition hover:scale-110',
                recommended && 'suggest-ring scale-110',
                current && 'ring-4 ring-foreground',
              )}
              style={{ backgroundColor: p.hex }}
            >
              {recommended && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground sm:size-6"
                >
                  <Star className="size-3 fill-current sm:size-3.5" />
                </span>
              )}
              <span className="sr-only">
                {p.name}
                {recommended ? ' (real rover color)' : ''}
                {current ? ' (current color)' : ''}
              </span>
            </button>
          )
        })}
        <label
          className={cn(
            'relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-full bg-card ring-2 ring-border transition hover:scale-110',
            currentIsCustom && 'ring-4 ring-foreground',
          )}
          style={currentIsCustom ? { backgroundColor: target?.currentHex } : undefined}
        >
          <Pipette
            className={cn('size-4 sm:size-5', currentIsCustom ? 'text-paper-foreground' : 'text-foreground')}
            aria-hidden="true"
          />
          <span className="sr-only">Mix your own color</span>
          <input
            type="color"
            value={target?.currentHex ?? '#888888'}
            onChange={(e) => onPick(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </fieldset>
  )
}
