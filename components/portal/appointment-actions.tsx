'use client';

import { useTransition } from 'react';
import { updateAppointmentStatus } from '@/lib/actions/appointments';
import { Button } from '@/components/ui/button';
import type { AppointmentStatus } from '@/lib/types';

export function AppointmentActions({ id, status }: { id: string; status: AppointmentStatus }) {
  const [pending, start] = useTransition();
  const set = (s: AppointmentStatus) => start(() => void updateAppointmentStatus(id, s));

  if (status === 'completed' || status === 'cancelled') return null;

  return (
    <div className="flex gap-2">
      {status === 'requested' && (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => set('confirmed')}>Confirm</Button>
      )}
      {status === 'confirmed' && (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => set('completed')}>Mark done</Button>
      )}
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => set('cancelled')}>Cancel</Button>
    </div>
  );
}
