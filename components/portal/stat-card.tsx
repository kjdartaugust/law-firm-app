import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="relative flex items-center gap-4 p-6">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold-sheen/5 transition-transform duration-500 group-hover:scale-150" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gold-sheen/15 text-gold">
          <Icon className="h-6 w-6" />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-0.5 font-serif text-2xl font-bold leading-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
