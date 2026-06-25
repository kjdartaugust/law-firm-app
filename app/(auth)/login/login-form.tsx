'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </Button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="redirect" value={redirectTo ?? '/dashboard'} />
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
      </div>
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
