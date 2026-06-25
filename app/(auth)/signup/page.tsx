import Link from 'next/link';
import { SignupForm } from './signup-form';

export const metadata = { title: 'Create account — Sterling & Crane' };

export default function SignupPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Open a secure client portal in moments.</p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already a client?{' '}
        <Link href="/login" className="font-medium text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
