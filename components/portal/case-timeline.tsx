import { Check, FolderOpen, Clock, Archive } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { CaseStatus } from '@/lib/types';

const STAGES: { key: CaseStatus; label: string; icon: typeof Check; desc: string }[] = [
  { key: 'open', label: 'Opened', icon: FolderOpen, desc: 'Matter intake complete' },
  { key: 'pending', label: 'In Progress', icon: Clock, desc: 'Active representation' },
  { key: 'closed', label: 'Resolved', icon: Archive, desc: 'Matter concluded' },
];

const ORDER: Record<CaseStatus, number> = { open: 0, pending: 1, closed: 2 };

export function CaseTimeline({
  status,
  openedAt,
  closedAt,
}: {
  status: CaseStatus;
  openedAt: string;
  closedAt: string | null;
}) {
  const current = ORDER[status];

  return (
    <ol className="relative space-y-0">
      {STAGES.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = done ? Check : stage.icon;
        const date = stage.key === 'open' ? openedAt : stage.key === 'closed' ? closedAt : null;
        return (
          <li key={stage.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* connector */}
            {i < STAGES.length - 1 && (
              <span
                className={cn(
                  'absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px',
                  done ? 'bg-gold' : 'bg-border'
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                done && 'border-gold bg-gold text-charcoal-950',
                active && 'border-gold bg-gold-sheen/15 text-gold',
                !done && !active && 'border-border bg-card text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="pt-1.5">
              <p className={cn('text-sm font-semibold', active && 'text-gold')}>{stage.label}</p>
              <p className="text-xs text-muted-foreground">{stage.desc}</p>
              {date && <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(date)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
