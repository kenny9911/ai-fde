"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────
//  Badge
// ─────────────────────────────────────────────────────────────────────────

const badgeVariants = {
  default: "border-transparent bg-primary/12 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
  outline: "border-border text-foreground",
  success: "border-transparent bg-[--color-success]/12 text-[--color-success]",
  warning: "border-transparent bg-[--color-warning]/15 text-[--color-warning]",
  danger: "border-transparent bg-[--color-danger]/12 text-[--color-danger]",
  info: "border-transparent bg-[--color-info]/12 text-[--color-info]",
  agent: "border-transparent bg-agent/12 text-agent",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export function Badge({
  variant = "muted",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Button
// ─────────────────────────────────────────────────────────────────────────

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-accent",
  ghost: "hover:bg-accent",
  agent: "bg-agent text-white hover:opacity-90",
} as const;

export function Button({
  variant = "outline",
  size = "sm",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: "sm" | "xs";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        size === "xs" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-[12px]",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Card
// ─────────────────────────────────────────────────────────────────────────

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Section header — the repeated "title + count + action" row
// ─────────────────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  count,
  action,
  className,
}: {
  title: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
        {count != null && (
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {count}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center">
      {icon && <div className="text-muted-foreground/60">{icon}</div>}
      <p className="text-[12px] text-muted-foreground">{title}</p>
      {hint && <p className="max-w-sm text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Confidence bar — three segments plus a percentage.
//  Same semantics everywhere: ≥90 safe, ≥70 review, <70 human judgement.
// ─────────────────────────────────────────────────────────────────────────

export function ConfidenceBar({
  value,
  className,
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.round(value * 100);
  const tier = value >= 0.9 ? "high" : value >= 0.7 ? "mid" : "low";
  const tone = {
    high: "text-[--color-success] border-[--color-success]/30 bg-[--color-success]/10",
    mid: "text-[--color-warning] border-[--color-warning]/35 bg-[--color-warning]/10",
    low: "text-[--color-danger] border-[--color-danger]/35 bg-[--color-danger]/10",
  }[tier];
  const fill = {
    high: "bg-[--color-success]",
    mid: "bg-[--color-warning]",
    low: "bg-[--color-danger]",
  }[tier];
  const filled = tier === "high" ? 3 : tier === "mid" ? 2 : 1;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
        tone,
        className,
      )}
      title={`Confidence ${pct}%`}
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1 rounded-sm",
              i < filled ? fill : "bg-current opacity-20",
            )}
          />
        ))}
      </span>
      {showLabel && <span>{pct}</span>}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Meter — a labelled horizontal progress bar
// ─────────────────────────────────────────────────────────────────────────

export function Meter({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: "primary" | "success" | "warning" | "danger" | "agent";
  className?: string;
}) {
  const bg = {
    primary: "bg-primary",
    success: "bg-[--color-success]",
    warning: "bg-[--color-warning]",
    danger: "bg-[--color-danger]",
    agent: "bg-agent",
  }[tone];
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", bg)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Repo path — the "git is the system of record" affordance
// ─────────────────────────────────────────────────────────────────────────

export function RepoPath({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "inline-flex items-center gap-1 rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
        className,
      )}
      title={path}
    >
      <span className="opacity-50">/</span>
      <span className="truncate">{path}</span>
    </code>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Tabs — minimal, controlled, no portal needed
// ─────────────────────────────────────────────────────────────────────────

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: Array<{ id: T; label: React.ReactNode; count?: number }>;
  active: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-0.5 border-b border-border", className)}
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={cn(
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  "rounded px-1 font-mono text-[10px] tabular-nums",
                  on ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
