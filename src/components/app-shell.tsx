"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ClipboardList,
  Files,
  Gavel,
  GitBranch,
  Languages,
  Lock,
  Moon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Plug,
  Sun,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale, useT, type ChromeKey } from "@/lib/i18n";
import { computeMetrics, engagement } from "@/data";
import { Badge } from "./ui";

const NAV: Array<{
  href: string;
  labelKey: ChromeKey;
  icon: React.ComponentType<{ className?: string }>;
  /** Which pipeline phase this surface belongs to — drives the accent bar. */
  phase: "ingest" | "understand" | "challenge" | "clarify" | "baseline";
}> = [
  { href: "/", labelKey: "nav.overview", icon: Network, phase: "ingest" },
  { href: "/sources", labelKey: "nav.sources", icon: Files, phase: "ingest" },
  { href: "/understanding", labelKey: "nav.understanding", icon: Workflow, phase: "understand" },
  { href: "/challenge", labelKey: "nav.challenge", icon: Gavel, phase: "challenge" },
  { href: "/questions", labelKey: "nav.questions", icon: ClipboardList, phase: "clarify" },
  { href: "/sessions", labelKey: "nav.sessions", icon: GitBranch, phase: "clarify" },
  { href: "/capabilities", labelKey: "nav.capabilities", icon: Plug, phase: "understand" },
  { href: "/baseline", labelKey: "nav.baseline", icon: Lock, phase: "baseline" },
];

const phaseAccent = {
  ingest: "text-phase-ingest",
  understand: "text-phase-understand",
  challenge: "text-phase-challenge",
  clarify: "text-phase-clarify",
  baseline: "text-phase-baseline",
} as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const metrics = React.useMemo(() => computeMetrics(), []);

  const badgeFor = (href: string): number | undefined => {
    if (href === "/questions") return metrics.openQuestions;
    if (href === "/challenge") return metrics.openFindings;
    return undefined;
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-muted/30 transition-[width] duration-200",
          collapsed ? "w-[52px]" : "w-[212px]",
        )}
      >
        <div
          className={cn(
            "flex h-11 shrink-0 items-center gap-2 border-b border-border px-3",
            collapsed && "justify-center px-0",
          )}
        >
          {!collapsed && (
            <>
              <span className="flex size-5 items-center justify-center rounded bg-agent/15 text-agent">
                <Network className="size-3" />
              </span>
              <span className="truncate text-[13px] font-semibold tracking-tight">
                {t("app.name")}
              </span>
            </>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !collapsed && "ml-auto",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-3.5" />
            ) : (
              <PanelLeftClose className="size-3.5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              const count = badgeFor(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon
                      className={cn("size-3.5 shrink-0", active && phaseAccent[item.phase])}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate">{t(item.labelKey)}</span>
                        {count != null && count > 0 && (
                          <span className="ml-auto rounded bg-muted px-1 font-mono text-[10px] tabular-nums text-muted-foreground">
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="shrink-0 border-t border-border p-3">
            <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
              {engagement.codename}
            </p>
            <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">
              {engagement.repo.split("/").pop()}
            </p>
          </div>
        )}
      </aside>

      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[12px] font-medium">
          {locale === "zh" ? engagement.client.zh : engagement.client.en}
        </span>
        <span className="text-muted-foreground/40">/</span>
        <span className="truncate text-[12px] text-muted-foreground">
          {locale === "zh" ? engagement.domain.zh : engagement.domain.en}
        </span>
      </div>

      <Badge variant="agent" className="shrink-0 gap-1">
        {t("common.round")} {engagement.currentRound}
      </Badge>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          className="inline-flex h-6 items-center gap-1 rounded px-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle language"
        >
          <Languages className="size-3.5" />
          {locale === "en" ? "EN" : "中"}
        </button>
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle theme"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="size-3.5" />
          ) : (
            <Moon className="size-3.5" />
          )}
        </button>
      </div>
    </header>
  );
}

/** Standard page header used by every surface. */
export function PageHeader({
  icon,
  title,
  subtitle,
  meta,
  actions,
  accent = "primary",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  accent?: "primary" | "agent" | "ingest" | "understand" | "challenge" | "clarify" | "baseline";
}) {
  const accentBar = {
    primary: "from-primary/0 via-primary/50 to-primary/0",
    agent: "from-agent/0 via-agent/50 to-agent/0",
    ingest: "from-transparent via-phase-ingest/50 to-transparent",
    understand: "from-transparent via-phase-understand/50 to-transparent",
    challenge: "from-transparent via-phase-challenge/50 to-transparent",
    clarify: "from-transparent via-phase-clarify/50 to-transparent",
    baseline: "from-transparent via-phase-baseline/50 to-transparent",
  }[accent];

  return (
    <div className="relative border-b border-border">
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", accentBar)} />
      <div className="flex items-start gap-3 px-6 py-4">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
            {meta}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
