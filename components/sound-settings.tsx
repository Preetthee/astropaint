'use client'

import { Music, Settings2, Sparkles, Volume2, VolumeX, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { sfx, speechSupported } from '@/lib/audio'
import { progressStore } from '@/lib/progress'
import { updateSettings, useSettings, type Settings } from '@/lib/settings'
import { useHydrated } from '@/lib/local-store'
import { cn } from '@/lib/utils'
import { Modal } from './modal'

function Toggle({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  icon: typeof Music
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-2xl bg-muted p-4 text-left transition hover:bg-border disabled:opacity-50"
    >
      <Icon className="size-7 shrink-0 text-accent" aria-hidden="true" />
      <span className="flex flex-1 flex-col">
        <span className="text-lg font-bold">{label}</span>
        <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-full transition',
          checked ? 'bg-secondary' : 'bg-background',
        )}
      >
        <span
          className={cn(
            'absolute top-1 size-6 rounded-full bg-foreground transition-all',
            checked ? 'left-7' : 'left-1',
          )}
        />
      </span>
    </button>
  )
}

export function SoundSettingsButton({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const settings = useSettings()
  const hydrated = useHydrated()
  const canSpeak = hydrated && speechSupported()

  const set = (patch: Partial<Settings>) => {
    updateSettings(patch)
    sfx.click()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.click()
          setOpen(true)
        }}
        className={cn(
          'flex h-14 items-center justify-center gap-2 rounded-full bg-card px-4 text-foreground shadow-lg ring-2 ring-border transition hover:-translate-y-0.5 hover:bg-muted',
          !showLabel && 'w-14 px-0',
          className,
        )}
      >
        <Settings2 className="size-6" aria-hidden="true" />
        <span className={showLabel ? 'text-lg font-bold' : 'sr-only'}>Sound settings</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Sound settings">
        <div className="flex flex-col gap-3">
          <Toggle
            label="Mute everything"
            description="Turn all sounds off at once."
            icon={settings.muted ? VolumeX : Volume2}
            checked={settings.muted}
            onChange={(v) => set({ muted: v })}
          />
          <Toggle
            label="Rover voice"
            description={
              canSpeak || !hydrated
                ? 'Rovers read their words out loud.'
                : 'Your browser does not support speaking. You can still read along!'
            }
            icon={MessageCircle}
            checked={settings.voice && canSpeak}
            disabled={settings.muted || (hydrated && !canSpeak)}
            onChange={(v) => set({ voice: v })}
          />
          <Toggle
            label="Sound effects"
            description="Pops, sparkles and cheers."
            icon={Sparkles}
            checked={settings.sfx}
            disabled={settings.muted}
            onChange={(v) => set({ sfx: v })}
          />
          <Toggle
            label="Space music"
            description="Calm background music."
            icon={Music}
            checked={settings.music}
            disabled={settings.muted}
            onChange={(v) => set({ music: v })}
          />
        </div>
        <div className="flex flex-col gap-2 border-t-2 border-border pt-4">
          {confirmReset ? (
            <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
              <p className="font-bold leading-relaxed">
                Start over? This clears all coloring, quiz stars and unlocked levels.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    progressStore.reset()
                    setConfirmReset(false)
                    setOpen(false)
                  }}
                  className="h-12 flex-1 rounded-full bg-primary font-bold text-primary-foreground"
                >
                  Yes, start over
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-12 flex-1 rounded-full bg-card font-bold ring-2 ring-border"
                >
                  Keep my progress
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="self-start text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Reset all game progress
            </button>
          )}
        </div>
      </Modal>
    </>
  )
}
