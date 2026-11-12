'use client'

import { Check, Search } from 'lucide-react'
import type { LevelData } from '@/lib/levels'
import { cn } from '@/lib/utils'

export function PartsList({
  level,
  discovered,
  selected,
  onSelect,
}: {
  level: LevelData
  discovered: string[]
  selected: string | null
  onSelect: (componentId: string) => void
}) {
  return (
    <section aria-labelledby="parts-heading" className="flex flex-col gap-2">
      <h2 id="parts-heading" className="text-lg font-bold">
        Parts to discover
      </h2>
      <ul className="flex flex-wrap gap-2">
        {level.components.map((c) => {
          const found = discovered.includes(c.id)
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-pressed={selected === c.id}
                className={cn(
                  'flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition hover:-translate-y-0.5',
                  found ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground',
                  selected === c.id && 'ring-4 ring-accent',
                )}
              >
                {found ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Search className="size-4" aria-hidden="true" />
                )}
                {found ? c.shortName : '???'}
                {!found && <span className="sr-only">Undiscovered part. Tap to find it.</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
