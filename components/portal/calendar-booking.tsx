'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isBefore, startOfToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check, CalendarDays, Clock } from 'lucide-react';
import { bookAppointment } from '@/lib/actions/appointments';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select, Label } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Profile, Case } from '@/lib/types';

const SLOTS = ['09:00', '09:30', '10:00', '11:00', '13:00', '13:30', '14:00', '15:00', '16:00', '16:30'];

export function CalendarBooking({
  lawyers, cases, defaultCaseId,
}: { lawyers: Profile[]; cases: Case[]; defaultCaseId?: string }) {
  const router = useRouter();
  const today = startOfToday();
  const [month, setMonth] = useState(startOfMonth(today));
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [month]);

  function submit(formData: FormData) {
    if (!date || !slot) {
      setError('Please choose a date and time.');
      return;
    }
    const [h, m] = slot.split(':').map(Number);
    const when = new Date(date);
    when.setHours(h, m, 0, 0);
    formData.set('scheduled_at', when.toISOString());
    setError(undefined);
    start(async () => {
      const res = await bookAppointment(formData);
      if (res?.error) setError(res.error);
      else {
        setDone(true);
        router.refresh();
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gold/30 bg-gold-50/60 p-12 text-center dark:bg-gold/5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-sheen text-charcoal-950">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-serif text-2xl font-bold">Request received</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Your consultation request for {date && format(date, 'EEEE, MMMM d')} at {slot} has been
          submitted. Our team will confirm shortly.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => { setDone(false); setDate(null); setSlot(null); }}>
          Book another
        </Button>
      </div>
    );
  }

  return (
    <form action={submit} className="grid gap-8 lg:grid-cols-2">
      {/* Calendar */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 font-serif text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-gold" /> {format(month, 'MMMM yyyy')}
          </p>
          <div className="flex gap-1">
            <button type="button" aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}
              disabled={isSameMonth(month, today)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const disabled = isBefore(d, today) || d.getDay() === 0 || d.getDay() === 6;
            const selected = date && isSameDay(d, date);
            const muted = !isSameMonth(d, month);
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => { setDate(d); setSlot(null); }}
                className={cn(
                  'aspect-square rounded-xl text-sm transition-all',
                  selected ? 'bg-gold-sheen font-semibold text-charcoal-950 shadow-gold'
                    : disabled ? 'cursor-not-allowed text-muted-foreground/30'
                    : 'hover:bg-accent',
                  muted && !selected && 'text-muted-foreground/50'
                )}
              >
                {format(d, 'd')}
              </button>
            );
          })}
        </div>

        {date && (
          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium"><Clock className="h-4 w-4 text-gold" /> Available times</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {SLOTS.map((s) => (
                <button key={s} type="button" onClick={() => setSlot(s)}
                  className={cn('rounded-lg border px-2 py-2 text-sm transition-all',
                    slot === s ? 'border-gold bg-gold-sheen/15 font-semibold text-gold' : 'border-border hover:border-gold/40')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-5 rounded-2xl border border-border bg-secondary/30 p-6">
        <div className="space-y-1.5">
          <Label htmlFor="subject">Matter / subject</Label>
          <Input id="subject" name="subject" required placeholder="e.g. Initial consultation" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lawyer_id">Preferred counsel</Label>
          <Select id="lawyer_id" name="lawyer_id" defaultValue="">
            <option value="">No preference</option>
            {lawyers.map((l) => <option key={l.id} value={l.id}>{l.full_name}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="duration_minutes">Duration</Label>
            <Select id="duration_minutes" name="duration_minutes" defaultValue="30">
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="case_id">Related case</Label>
            <Select id="case_id" name="case_id" defaultValue={defaultCaseId ?? ''}>
              <option value="">None</option>
              {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} placeholder="Anything we should know in advance?" />
        </div>

        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          {date && slot ? (
            <span className="font-medium text-gold">{format(date, 'EEEE, MMMM d')} · {slot}</span>
          ) : (
            <span className="text-muted-foreground">Select a date and time to continue.</span>
          )}
        </div>

        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending || !date || !slot}>
          {pending ? 'Submitting…' : 'Request appointment'}
        </Button>
      </div>
    </form>
  );
}
