'use client'

import { useCallback, useReducer } from 'react'
import type { Fills } from './progress'

export const PALETTE: { name: string; hex: string }[] = [
  { name: 'Mars red', hex: '#d9482b' },
  { name: 'Orange', hex: '#f5862e' },
  { name: 'Sunny yellow', hex: '#ffd23f' },
  { name: 'Sand', hex: '#e9c99a' },
  { name: 'Dusty brown', hex: '#9a5b3c' },
  { name: 'Lime', hex: '#9bd14a' },
  { name: 'Green', hex: '#2fa860' },
  { name: 'Teal', hex: '#2ec4b6' },
  { name: 'Sky blue', hex: '#62b6f0' },
  { name: 'Blue', hex: '#2f6fd6' },
  { name: 'Purple', hex: '#8c5bd6' },
  { name: 'Pink', hex: '#f27eb4' },
  { name: 'Rover white', hex: '#f3f1ea' },
  { name: 'Silver', hex: '#b7bfcc' },
  { name: 'Metal gray', hex: '#6d7585' },
  { name: 'Charcoal', hex: '#3a3f4f' },
]

const MAX_HISTORY = 100

interface HistoryState {
  past: Fills[]
  present: Fills
  future: Fills[]
}

type Action =
  | { type: 'paint'; regionId: string; color: string | null }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' }

function reducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'paint': {
      const current = state.present[action.regionId] ?? null
      if (current === action.color) return state
      const next = { ...state.present }
      if (action.color === null) delete next[action.regionId]
      else next[action.regionId] = action.color
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: next,
        future: [],
      }
    }
    case 'undo': {
      if (!state.past.length) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      }
    }
    case 'redo': {
      if (!state.future.length) return state
      const [next, ...rest] = state.future
      return { past: [...state.past, state.present], present: next, future: rest }
    }
    case 'reset': {
      if (!Object.keys(state.present).length) return state
      return { past: [...state.past, state.present].slice(-MAX_HISTORY), present: {}, future: [] }
    }
  }
}

/** Region-fill history with undo / redo / reset. Reset itself can be undone. */
export function useColoringHistory(initial: Fills) {
  const [state, dispatch] = useReducer(reducer, { past: [], present: initial, future: [] })
  return {
    fills: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    paint: useCallback((regionId: string, color: string | null) => dispatch({ type: 'paint', regionId, color }), []),
    undo: useCallback(() => dispatch({ type: 'undo' }), []),
    redo: useCallback(() => dispatch({ type: 'redo' }), []),
    reset: useCallback(() => dispatch({ type: 'reset' }), []),
  }
}

/** Renders an SVG element to a PNG and downloads it. */
export async function downloadSvgAsPng(svg: SVGSVGElement, fileName: string, caption: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.querySelectorAll('.region-glow').forEach((el) => el.remove())
  clone.setAttribute('width', '1600')
  clone.setAttribute('height', '1200')
  const xml = new XMLSerializer().serializeToString(clone)
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Could not render artwork'))
      img.src = url
    })

    const footer = 110
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 1200 + footer
    const g = canvas.getContext('2d')
    if (!g) throw new Error('Canvas unavailable')
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, canvas.width, canvas.height)
    g.drawImage(img, 0, 0, 1600, 1200)
    g.fillStyle = '#0e1a3a'
    g.fillRect(0, 1200, canvas.width, footer)
    g.fillStyle = '#f4f6ff'
    g.font = 'bold 44px ui-rounded, system-ui, sans-serif'
    g.textBaseline = 'middle'
    g.fillText(caption, 48, 1200 + footer / 2)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Could not create image')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(link.href), 2000)
  } finally {
    URL.revokeObjectURL(url)
  }
}
