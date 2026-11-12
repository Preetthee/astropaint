'use client'

import { useSyncExternalStore } from 'react'
import type { VoiceLine, VoiceProfile } from './levels/types'
import { settingsStore } from './settings'

/* ============================================================
   Voice: one line at a time. Prerecorded audio wins when a
   VoiceLine has `audioSrc`; otherwise browser SpeechSynthesis.
   ============================================================ */

export type VoiceStatus = 'idle' | 'speaking'
interface VoiceState {
  status: VoiceStatus
  text: string | null
}

let voiceState: VoiceState = { status: 'idle', text: null }
const voiceListeners = new Set<() => void>()
let currentAudio: HTMLAudioElement | null = null
let speakToken = 0

const setVoiceState = (next: VoiceState) => {
  voiceState = next
  voiceListeners.forEach((l) => l())
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Pronunciation help for instrument acronyms (display text stays unchanged). */
const PRONUNCIATIONS: [RegExp, string][] = [
  [/Mastcam-Z/g, 'Mast-cam Zee'],
  [/Mastcam/g, 'Mast-cam'],
  [/SuperCam/g, 'Super Cam'],
  [/ChemCam/g, 'Chem Cam'],
  [/\bPIXL\b/g, 'Pixel'],
  [/\bSHERLOC\b/g, 'Sherlock'],
  [/\bRIMFAX\b/g, 'Rim-fax'],
  [/\bMOXIE\b/g, 'Moxie'],
  [/\bMAHLI\b/g, 'Mah-lee'],
  [/\bMMRTG\b/g, 'M M R T G'],
  [/\bSAM\b/g, 'Sam'],
  [/\bRAD\b/g, 'Rad'],
  [/\bNASA\b/g, 'NASA'],
]

const toSpeech = (text: string) =>
  PRONUNCIATIONS.reduce((acc, [re, say]) => acc.replace(re, say), text)

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const english = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'))
  const preferred = [
    'Google US English',
    'Samantha',
    'Microsoft Aria',
    'Microsoft Jenny',
    'Karen',
    'Google UK English Female',
  ]
  for (const name of preferred) {
    const v = english.find((voice) => voice.name.includes(name))
    if (v) return v
  }
  return english.find((v) => v.lang === 'en-US') ?? english[0]
}

if (speechSupported()) {
  // Some browsers load voices asynchronously.
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}

export function stopVoice() {
  speakToken++
  if (speechSupported()) window.speechSynthesis.cancel()
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (voiceState.status !== 'idle') setVoiceState({ status: 'idle', text: null })
}

export type SpeakResult = 'started' | 'disabled' | 'unavailable'

function speakWithSynthesis(text: string, profile: VoiceProfile, token: number): SpeakResult {
  if (!speechSupported()) {
    setVoiceState({ status: 'idle', text: null })
    return 'unavailable'
  }
  const utterance = new SpeechSynthesisUtterance(toSpeech(text))
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'en-US'
  utterance.pitch = profile.pitch
  utterance.rate = profile.rate
  const finish = () => {
    if (token === speakToken) setVoiceState({ status: 'idle', text: null })
  }
  utterance.onend = finish
  utterance.onerror = finish
  setVoiceState({ status: 'speaking', text })
  // Chrome can drop an utterance queued in the same tick as cancel().
  window.setTimeout(() => {
    if (token === speakToken) window.speechSynthesis.speak(utterance)
  }, 60)
  return 'started'
}

export function speak(line: VoiceLine, profile: VoiceProfile): SpeakResult {
  stopVoice()
  const settings = settingsStore.get()
  if (!settings.voice || settings.muted) return 'disabled'
  const token = ++speakToken

  if (line.audioSrc) {
    const audio = new Audio(line.audioSrc)
    currentAudio = audio
    setVoiceState({ status: 'speaking', text: line.text })
    audio.onended = () => {
      if (token === speakToken) setVoiceState({ status: 'idle', text: null })
    }
    audio.play().catch(() => {
      if (token === speakToken) speakWithSynthesis(line.text, profile, token)
    })
    return 'started'
  }
  return speakWithSynthesis(line.text, profile, token)
}

export function useVoiceState() {
  return useSyncExternalStore(
    (l) => {
      voiceListeners.add(l)
      return () => voiceListeners.delete(l)
    },
    () => voiceState,
    () => voiceState,
  )
}

/* ============================================================
   Sound effects + background music, synthesized with Web Audio
   so no audio files or licenses are needed.
   ============================================================ */

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function unlockAudio() {
  getCtx()
}

function tone(
  freq: number,
  start: number,
  dur: number,
  { type = 'sine', gain = 0.14, slideTo }: { type?: OscillatorType; gain?: number; slideTo?: number } = {},
) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

const sfxOn = () => {
  const s = settingsStore.get()
  return s.sfx && !s.muted
}

export const sfx = {
  click() {
    if (sfxOn()) tone(660, 0, 0.08, { type: 'triangle', gain: 0.08 })
  },
  paint() {
    if (!sfxOn()) return
    tone(420, 0, 0.12, { type: 'sine', gain: 0.16, slideTo: 760 })
  },
  erase() {
    if (sfxOn()) tone(500, 0, 0.14, { type: 'triangle', gain: 0.1, slideTo: 220 })
  },
  correct() {
    if (!sfxOn()) return
    ;[523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.09, 0.25, { type: 'triangle', gain: 0.13 }))
  },
  gentle() {
    if (!sfxOn()) return
    tone(392, 0, 0.18, { type: 'sine', gain: 0.12 })
    tone(330, 0.16, 0.26, { type: 'sine', gain: 0.1 })
  },
  fanfare() {
    if (!sfxOn()) return
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
    notes.forEach((f, i) => tone(f, i * 0.12, 0.32, { type: 'triangle', gain: 0.13 }))
  },
  whoosh() {
    if (sfxOn()) tone(200, 0, 0.35, { type: 'sawtooth', gain: 0.04, slideTo: 900 })
  },
}

let musicTimer: number | null = null
let musicGain: GainNode | null = null
let musicStep = 0
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
const PATTERN = [0, 2, 4, 5, 4, 2, 3, 1, 0, 4, 6, 5, 7, 5, 4, 2]

function musicNote(freq: number, dur: number, gain: number) {
  const c = getCtx()
  if (!c || !musicGain) return
  const t0 = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.08)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(musicGain)
  osc.start(t0)
  osc.stop(t0 + dur + 0.1)
}

export function setMusicPlaying(on: boolean) {
  if (typeof window === 'undefined') return
  if (!on) {
    if (musicTimer) window.clearInterval(musicTimer)
    musicTimer = null
    if (musicGain && ctx) {
      musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
    }
    return
  }
  if (musicTimer) return
  const c = getCtx()
  if (!c) return
  musicGain = c.createGain()
  musicGain.gain.value = 0.35
  musicGain.connect(c.destination)
  musicTimer = window.setInterval(() => {
    const idx = PATTERN[musicStep % PATTERN.length]
    musicNote(SCALE[idx], 1.6, 0.06)
    if (musicStep % 4 === 0) musicNote(SCALE[idx] / 2, 3.2, 0.05)
    musicStep++
  }, 520)
}
