import { cn } from '@/lib/utils'

/**
 * Friendly character face based on the rover's mast head:
 * the camera lenses become eyes.
 */
export function RoverAvatar({
  accent,
  talking = false,
  className,
}: {
  accent: 'primary' | 'secondary'
  talking?: boolean
  className?: string
}) {
  const color = accent === 'primary' ? 'var(--primary)' : 'var(--secondary)'
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn('shrink-0', className)}>
      <rect x="44" y="70" width="12" height="28" rx="4" fill="var(--muted-foreground)" />
      <rect x="10" y="12" width="80" height="62" rx="18" fill={color} stroke="var(--background)" strokeWidth="4" />
      <rect x="18" y="20" width="64" height="20" rx="8" fill="var(--paper)" opacity="0.25" />
      <g className="eye-blink">
        <circle cx="35" cy="42" r="12" fill="var(--paper)" stroke="var(--background)" strokeWidth="3" />
        <circle cx="65" cy="42" r="12" fill="var(--paper)" stroke="var(--background)" strokeWidth="3" />
        <circle cx="37" cy="43" r="5.5" fill="var(--background)" />
        <circle cx="67" cy="43" r="5.5" fill="var(--background)" />
        <circle cx="39" cy="40.5" r="1.8" fill="var(--paper)" />
        <circle cx="69" cy="40.5" r="1.8" fill="var(--paper)" />
      </g>
      <rect
        x="40"
        y="58"
        width="20"
        height="8"
        rx="4"
        fill="var(--background)"
        className={talking ? 'mouth-talking' : undefined}
      />
      <circle cx="22" cy="60" r="4" fill="var(--accent)" opacity="0.8" />
      <circle cx="78" cy="60" r="4" fill="var(--accent)" opacity="0.8" />
    </svg>
  )
}
