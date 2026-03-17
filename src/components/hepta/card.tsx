import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated";

export interface CardProps {
  title?: string;
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

export function Card({ title, children, variant = "default", className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card text-card-foreground",
        variant === "elevated" && "shadow-md",
        className
      )}
    >
      {title && (
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
