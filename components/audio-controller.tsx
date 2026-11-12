'use client'

import { useEffect } from 'react'
import { setMusicPlaying, stopVoice, unlockAudio } from '@/lib/audio'
import { useSettings } from '@/lib/settings'

/** Keeps background music and voice in sync with saved sound settings. */
export function AudioController() {
  const { music, muted, voice } = useSettings()

  useEffect(() => {
    const wantMusic = music && !muted
    if (!wantMusic) {
      setMusicPlaying(false)
      return
    }
    // Browsers only allow audio after a user gesture.
    const start = () => {
      unlockAudio()
      setMusicPlaying(true)
    }
    start()
    window.addEventListener('pointerdown', start, { once: true })
    return () => window.removeEventListener('pointerdown', start)
  }, [music, muted])

  useEffect(() => {
    if (muted || !voice) stopVoice()
  }, [muted, voice])

  useEffect(() => () => setMusicPlaying(false), [])

  return null
}
