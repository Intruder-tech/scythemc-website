"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * Chunky "logo letter" buttons: solid face, navy outline, hard bevel underneath.
 * Pressing drops the face onto the bevel.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-ink-950 font-display uppercase tracking-wide transition-[transform,box-shadow,background-color,color] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)] hover:bg-sun",
        azure: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)] hover:bg-[#1ea6ff]",
        cyan: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)] hover:bg-[#5ff2fc]",
        outline:
          "border-ink-700 bg-ink-900 text-frost shadow-[0_4px_0_var(--color-ink-950)] hover:border-azure hover:text-cyan",
        ghost: "border-transparent bg-transparent text-mist hover:text-frost active:translate-y-0",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
