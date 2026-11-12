import type { CSSProperties } from 'react'

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seeded(42)
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  top: rand() * 100,
  size: rand() < 0.15 ? 3 : rand() < 0.5 ? 2 : 1.5,
  dur: 2 + rand() * 4,
  delay: rand() * 4,
}))

export function SpaceBackground({ dense = true }: { dense?: boolean }) {
  const stars = dense ? STARS : STARS.slice(0, 45)
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              '--dur': `${s.dur}s`,
              '--delay': `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {dense && (
        <>
          <span className="shooting-star" style={{ top: '22%', animationDelay: '1s' }} />
          <span className="shooting-star" style={{ top: '64%', animationDelay: '5.5s' }} />
        </>
      )}
    </div>
  )
}
