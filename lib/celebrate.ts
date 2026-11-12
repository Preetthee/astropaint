'use client'

import confetti from 'canvas-confetti'

const COLORS = ['#f06a2c', '#ffc93c', '#2ec4b6', '#f4f6ff']

export function celebrate() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const end = Date.now() + 1200
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: COLORS })
    confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.55 }, colors: COLORS, shapes: ['star', 'circle'] })
  frame()
}
