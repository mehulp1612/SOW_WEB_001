// Adapted from the MIT-licensed shadcn/ui Radix Button pattern.
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:pointer-events-none disabled:opacity-60', {
  variants: { variant: { default: 'bg-[#173d35] text-white hover:bg-[#26584c]', outline: 'border border-[#b8c5bd] bg-transparent text-[#173d35] hover:bg-[#e8eee8]' }, size: { default: 'px-6 py-3.5', small: 'px-4 py-2.5' } },
  defaultVariants: { variant: 'default', size: 'default' },
});
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';
