import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = "md", text, fullScreen, className, ...props }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm font-medium text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", className)}
        {...props}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center justify-center p-8", className)} {...props}>
      {content}
    </div>
  );
}
