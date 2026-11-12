'use client'

import { Square, Volume2 } from 'lucide-react'
import { speechSupported, stopVoice, useVoiceState } from '@/lib/audio'
import type { LevelData } from '@/lib/levels'
import { useHydrated } from '@/lib/local-store'
import { useSettings } from '@/lib/settings'
import { RoverAvatar } from '@/components/rover-avatar'

export function CharacterDialog({
  level,
  heading,
  text,
  onReplay,
}: {
  level: LevelData
  heading: string
  text: string
  onReplay: () => void
}) {
  const voice = useVoiceState()
  const settings = useSettings()
  const hydrated = useHydrated()
  const speaking = voice.status === 'speaking' && voice.text === text
  const voiceOff = settings.muted || !settings.voice
  const noSpeech = hydrated && !speechSupported()

  return (
    <section
      aria-label={`${level.name} says`}
      className="flex items-start gap-3 rounded-3xl bg-paper p-3 text-paper-foreground shadow-xl md:p-4"
    >
      <RoverAvatar accent={level.accent} talking={speaking} className="size-14 md:size-16" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-lg leading-tight font-bold md:text-xl">{heading}</h2>
        <p aria-live="polite" className="text-base leading-relaxed font-semibold md:text-lg">
          {text}
        </p>
        {hydrated && (voiceOff || noSpeech) && (
          <p className="text-sm text-[#4a5272]">
            {noSpeech
              ? 'Voice is not available in this browser — read along!'
              : 'Voice is off. Turn it on in sound settings.'}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => (speaking ? stopVoice() : onReplay())}
        disabled={hydrated && (voiceOff || noSpeech)}
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 disabled:opacity-40 md:size-14"
      >
        {speaking ? (
          <Square className="size-5 fill-current" aria-hidden="true" />
        ) : (
          <Volume2 className="size-6" aria-hidden="true" />
        )}
        <span className="sr-only">{speaking ? 'Stop talking' : 'Hear it again'}</span>
      </button>
    </section>
  )
}
