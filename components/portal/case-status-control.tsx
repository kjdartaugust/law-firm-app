'use client';

import { useTransition } from 'react';
import { updateCaseStatus } from '@/lib/actions/cases';
import { Select } from '@/components/ui/input';
import type { CaseStatus } from '@/lib/types';

export function CaseStatusControl({ caseId, status }: { caseId: string; status: CaseStatus }) {
  const [pending, start] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => void updateCaseStatus(caseId, e.target.value as CaseStatus))}
      className="h-9 w-36"
    >
      <option value="open">Open</option>
      <option value="pending">Pending</option>
      <option value="closed">Closed</option>
    </Select>
  );
}
