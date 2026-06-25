import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata = { title: 'Sign in — Sterling & Crane' };

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to your client portal.</p>
      <LoginForm redirectTo={searchParams.redirect} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New client?{' '}
        <Link href="/signup" className="font-medium text-gold hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
