import { STATUS_LABEL, type ExplorerStatus } from '@/lib/legacy/explorers'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: ExplorerStatus; className?: string }) {
  const alive = status !== 'silent'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase',
        alive ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-2 rounded-full', alive ? 'animate-pulse bg-secondary-foreground' : 'bg-muted-foreground')}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
