
import * as React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
}

export function Loader({
  size = "md",
  variant = "default",
  className,
  ...props
}: LoaderProps) {
  const sizeStyles = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
    xl: "h-12 w-12 border-4",
  };

  const variantStyles = {
    default: "border-muted-foreground/30 border-t-muted-foreground",
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <Loader size="xl" variant="primary" />
        <p className="mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader size="xl" variant="primary" />
        <p className="mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
