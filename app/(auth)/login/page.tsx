import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata = { title: 'Sign in — Lexara Legal' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  return (
    <div>
      <p className="eyebrow mb-3">Client Portal</p>
      <h1 className="font-serif text-3xl font-bold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sign in to access your matters.</p>
      <LoginForm redirectTo={redirect} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New client?{' '}
        <Link href="/signup" className="font-medium text-gold hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
