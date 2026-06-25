import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'gold' | 'light';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
  outline: 'border border-border bg-transparent hover:bg-accent',
  ghost: 'hover:bg-accent',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
  gold: 'bg-gold-sheen text-charcoal-950 font-semibold shadow-gold hover:brightness-105',
  light: 'bg-white/10 text-white border border-white/25 backdrop-blur hover:bg-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
