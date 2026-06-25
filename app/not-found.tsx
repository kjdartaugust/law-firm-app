import Link from 'next/link';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center container-px">
      <Scale className="h-10 w-10 text-gold" />
      <h1 className="font-serif text-4xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/"><Button variant="gold">Return home</Button></Link>
    </div>
  );
}
