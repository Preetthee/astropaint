'use client'

import { Pipette } from 'lucide-react'
import { PALETTE } from '@/lib/coloring'
import { cn } from '@/lib/utils'

export function ColorPalette({
  color,
  onChange,
  active,
}: {
  color: string
  onChange: (hex: string) => void
  active: boolean
}) {
  const isCustom = !PALETTE.some((p) => p.hex === color)
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Choose a color</legend>
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2 lg:grid-cols-3">
        {PALETTE.map((p) => {
          const selected = active && color === p.hex
          return (
            <button
              key={p.hex}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(p.hex)}
              className={cn(
                'aspect-square w-full rounded-full ring-2 ring-background transition hover:scale-110',
                selected && 'scale-110 ring-4 ring-accent',
              )}
              style={{ backgroundColor: p.hex }}
            >
              <span className="sr-only">{p.name}</span>
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
