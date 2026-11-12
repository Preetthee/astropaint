'use client'

import { createContext, useContext, type KeyboardEvent, type ReactNode } from 'react'

export const OUTLINE = '#1c1f2e'
export const BLANK = '#ffffff'

interface IllustrationContextValue {
  fills: Record<string, string>
  highlighted: ReadonlySet<string>
  interactive: boolean
  labels: Record<string, string>
  idPrefix: string
  onRegion?: (regionId: string) => void
}

export const IllustrationContext = createContext<IllustrationContextValue>({
  fills: {},
  highlighted: new Set(),
  interactive: false,
  labels: {},
  idPrefix: 'region-',
})

export interface IllustrationProps {
  fills: Record<string, string>
  highlighted?: ReadonlySet<string>
  interactive?: boolean
  labels?: Record<string, string>
  onRegion?: (regionId: string) => void
  title: string
  svgRef?: React.Ref<SVGSVGElement>
  className?: string
  /** Prefix for DOM ids so several copies can render on one page. */
  idPrefix?: string
}

const EMPTY_SET: ReadonlySet<string> = new Set()
const EMPTY_LABELS: Record<string, string> = {}

export function IllustrationFrame({
  children,
  title,
  svgRef,
  className,
  fills,
  highlighted = EMPTY_SET,
  interactive = false,
  labels = EMPTY_LABELS,
  idPrefix = 'region-',
  onRegion,
}: IllustrationProps & { children: ReactNode }) {
  return (
    <IllustrationContext.Provider value={{ fills, highlighted, interactive, labels, idPrefix, onRegion }}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        role={interactive ? 'group' : 'img'}
        aria-label={title}
        className={className}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <title>{title}</title>
        {children}
      </svg>
    </IllustrationContext.Provider>
  )
}

function useRegion(id: string) {
  const ctx = useContext(IllustrationContext)
  const fill = ctx.fills[id] ?? BLANK
  const isHighlighted = ctx.highlighted.has(id)
  const label = ctx.labels[id] ?? id
  const interactiveProps = ctx.interactive
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': `${label}${ctx.fills[id] ? ', colored' : ', not colored yet'}`,
        onClick: () => ctx.onRegion?.(id),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            ctx.onRegion?.(id)
          }
        },
      }
    : {}
  return {
    fill,
    isHighlighted,
    interactiveProps,
    interactive: ctx.interactive,
    domId: `${ctx.idPrefix}${id}`,
  }
}

/**
 * A colorable area. Children must be plain SVG shapes without fill/stroke
 * attributes so they inherit the region's fill and the black outline.
 */
export function Region({ id, children }: { id: string; children: ReactNode }) {
  const { fill, isHighlighted, interactiveProps, interactive, domId } = useRegion(id)
  return (
    <g id={domId} data-region={id} className={interactive ? 'region' : undefined} {...interactiveProps}>
      <g fill={fill} stroke={OUTLINE} strokeWidth={3.5}>
        {children}
      </g>
      {isHighlighted && <g className="region-glow">{children}</g>}
    </g>
  )
}

/** A colorable thick line (mast poles, arm segments, legs). */
export function TubeRegion({ id, d, width }: { id: string; d: string; width: number }) {
  const { fill, isHighlighted, interactiveProps, interactive, domId } = useRegion(id)
  return (
    <g id={domId} data-region={id} className={interactive ? 'region' : undefined} {...interactiveProps}>
      {isHighlighted && (
        <path d={d} fill="none" stroke="#ffc93c" strokeWidth={width + 16} opacity={0.75} />
      )}
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={width + 7} />
      <path d={d} fill="none" stroke={fill} strokeWidth={width} />
    </g>
  )
}

/** Non-interactive line art drawn on top of regions. */
export function Detail({ children, width = 2.25 }: { children: ReactNode; width?: number }) {
  return (
    <g fill="none" stroke={OUTLINE} strokeWidth={width} pointerEvents="none">
      {children}
    </g>
  )
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)] as const
}

export function hexagonPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => polar(cx, cy, r, i * 60).join(',')).join(' ')
}

/**
 * Rover wheel seen from the side.
 * - "perseverance": gently curved spokes and many straight grouser treads.
 * - "curiosity": chevron (zigzag) treads, as NASA describes Curiosity's wheels.
 */
export function Wheel({
  id,
  cx,
  cy,
  r,
  variant,
}: {
  id: string
  cx: number
  cy: number
  r: number
  variant: 'perseverance' | 'curiosity'
}) {
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = i * 60 + (variant === 'perseverance' ? 10 : 0)
    const [x1, y1] = polar(cx, cy, r * 0.28, a)
    const [qx, qy] = polar(cx, cy, r * 0.55, a + (variant === 'perseverance' ? 32 : 10))
    const [x2, y2] = polar(cx, cy, r * 0.74, a + (variant === 'perseverance' ? 48 : 16))
    return `M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`
  })

  const treads =
    variant === 'perseverance'
      ? Array.from({ length: 28 }, (_, i) => {
          const a = (360 / 28) * i
          const [x1, y1] = polar(cx, cy, r * 0.84, a)
          const [x2, y2] = polar(cx, cy, r * 0.98, a + 4)
          return `M${x1} ${y1} L${x2} ${y2}`
        })
      : Array.from({ length: 14 }, (_, i) => {
          const a = (360 / 14) * i
          const [x1, y1] = polar(cx, cy, r * 0.84, a - 7)
          const [x2, y2] = polar(cx, cy, r * 0.97, a)
          const [x3, y3] = polar(cx, cy, r * 0.84, a + 7)
          return `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}`
        })

  return (
    <>
      <Region id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </Region>
      <Detail>
        <circle cx={cx} cy={cy} r={r * 0.8} />
        <circle cx={cx} cy={cy} r={r * 0.28} />
        <circle cx={cx} cy={cy} r={r * 0.1} />
        {spokes.map((d) => (
          <path key={d} d={d} />
        ))}
        {treads.map((d) => (
          <path key={d} d={d} />
        ))}
      </Detail>
    </>
  )
}
