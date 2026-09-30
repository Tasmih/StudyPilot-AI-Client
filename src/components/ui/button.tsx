import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    
    // Base styles
    const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ring-offset-background cursor-pointer select-none";
    
    // Variant styles
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/95 shadow-sm",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/95 shadow-sm",
      outline: "border border-input bg-transparent hover:bg-slate-100 active:bg-slate-200/80 hover:text-foreground dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
      ghost: "hover:bg-slate-100 active:bg-slate-200/80 hover:text-foreground dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm",
    };

    // Size styles
    const sizes = {
      sm: "h-9 px-3",
      md: "h-10 py-2 px-4",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
