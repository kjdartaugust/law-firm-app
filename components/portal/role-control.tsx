'use client';

import { useTransition } from 'react';
import { setUserRole } from '@/lib/actions/profile';
import { Select } from '@/components/ui/input';
import type { UserRole } from '@/lib/types';

export function RoleControl({ userId, role }: { userId: string; role: UserRole }) {
  const [pending, start] = useTransition();
  return (
    <Select
      defaultValue={role}
      disabled={pending}
      onChange={(e) => start(() => void setUserRole(userId, e.target.value as UserRole))}
      className="h-8 w-28 text-xs"
    >
      <option value="client">Client</option>
      <option value="lawyer">Lawyer</option>
      <option value="admin">Admin</option>
    </Select>
  );
}
