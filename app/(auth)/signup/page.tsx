import Link from 'next/link';
import { SignupForm } from './signup-form';

export const metadata = { title: 'Create account — Lexara Legal' };

export default function SignupPage() {
  return (
    <div>
      <p className="eyebrow mb-3">Open an Account</p>
      <h1 className="font-serif text-3xl font-bold">Create your portal</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Private, secure access in moments.</p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already a client?{' '}
        <Link href="/login" className="font-medium text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
