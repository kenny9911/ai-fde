"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  GitCommitHorizontal,
  Layers,
  Network,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, Meter, RepoPath, SectionHeader } from "@/components/ui";
import { SeatBadge } from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { fmtDateTime } from "@/lib/utils";
import {
  activity,
  baseline,
  computeMetrics,
  engagement,
  findings,
  questions,
  scenarios,
} from "@/data";
import type { PhaseId } from "@/lib/types";

const phaseTone: Record<PhaseId, string> = {
  ingest: "bg-[--color-phase-ingest]",
  understand: "bg-[--color-phase-understand]",
  challenge: "bg-[--color-phase-challenge]",
  clarify: "bg-[--color-phase-clarify]",
  baseline: "bg-[--color-phase-baseline]",
};

export default function OverviewPage() {
  const t = useT();
  const b = useB();
  const m = React.useMemo(() => computeMetrics(), []);

  // What a lead would actually want surfaced first: the things that will stop
  // the freeze, ordered by how badly they block it.
  const attention = React.useMemo(() => {
    const failingGates = baseline.gates.filter((g) => g.status === "fail");
    const blockers = questions.filter(
      (q) => q.severity === "blocker" && (q.status === "asked" || q.status === "draft"),
    );
    const openFindings = findings.filter((f) => f.verdict === "open");
    const thinScenarios = scenarios.filter((s) => s.sourceCoverage < 70);
    return { failingGates, blockers, openFindings, thinScenarios };
  }, []);

  return (
    <>
      <PageHeader
        icon={<Network className="size-4 text-agent" />}
        title={t("overview.title")}
        subtitle={`${b(engagement.targetSystem)} · ${engagement.leadFde} / ${engagement.leadConsultant}`}
        accent="agent"
        meta={
          <>
            <Badge variant="outline" className="font-mono">
              {engagement.codename}
            </Badge>
            <Badge variant="agent">
              {t("common.round")} {engagement.currentRound}
            </Badge>
          </>
        }
        actions={<RepoPath path={engagement.repo} />}
      />

      <div className="space-y-6 p-6">
        {/* ── Metric tiles ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Tile
            label={t("common.openQuestions")}
            value={m.openQuestions}
            sub={b({
              en: `${m.blockerQuestions} blocker`,
              zh: `其中 ${m.blockerQuestions} 项阻断`,
            })}
            tone={m.blockerQuestions > 0 ? "danger" : "success"}
            href="/questions"
          />
          <Tile
            label={t("common.findings")}
            value={m.openFindings}
            sub={b({
              en: `${m.upheldFindings} upheld · ${m.refutedFindings} refuted`,
              zh: `成立 ${m.upheldFindings} · 不成立 ${m.refutedFindings}`,
            })}
            tone={m.openFindings > 0 ? "warning" : "success"}
            href="/challenge"
          />
          <Tile
            label={b({ en: "Scenarios agreed", zh: "场景已达成一致" })}
            value={`${m.scenariosAgreed}/${m.scenariosTotal}`}
            sub={b({
              en: `mean coverage ${m.meanCoverage}%`,
              zh: `平均来源覆盖 ${m.meanCoverage}%`,
            })}
            tone={m.scenariosAgreed === m.scenariosTotal ? "success" : "warning"}
            href="/understanding"
          />
          <Tile
            label={b({ en: "Source gaps", zh: "来源缺口" })}
            value={m.unreadablePages + m.unanalysedPages}
            sub={b({
              en: `${m.unreadablePages} unreadable · ${m.unanalysedPages} unanalysed`,
              zh: `无法识别 ${m.unreadablePages} · 未分析 ${m.unanalysedPages}`,
            })}
            tone={m.unreadablePages > 0 ? "danger" : "success"}
            href="/sources"
          />
          <Tile
            label={t("baseline.readiness")}
            value={`${m.baselineReadiness}%`}
            sub={baseline.version}
            tone={m.baselineReadiness >= 80 ? "success" : "danger"}
            href="/baseline"
          />
        </div>

        {/* ── The loop ────────────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader title={t("overview.pipeline")} />
          <div className="grid gap-3 lg:grid-cols-5">
            {engagement.phases.map((p, i) => (
              <Card
                key={p.id}
                className={
                  p.status === "active"
                    ? "relative overflow-hidden ring-1 ring-agent/30"
                    : "relative overflow-hidden"
                }
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 ${phaseTone[p.id]} ${
                    p.status === "pending" ? "opacity-25" : ""
                  }`}
                />
                <div className="space-y-2 p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-[12px] font-medium">
                      {b(p.name)}
                    </span>
                    {p.status === "active" && (
                      <span className="ml-auto size-1.5 shrink-0 rounded-full bg-agent animate-pulse-ring" />
                    )}
                    {p.status === "done" && (
                      <CheckCircle2 className="ml-auto size-3 shrink-0 text-[--color-success]" />
                    )}
                  </div>
                  <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
                    {b(p.purpose)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Meter
                      value={p.progress}
                      tone={
                        p.status === "done"
                          ? "success"
                          : p.status === "active"
                            ? "agent"
                            : "primary"
                      }
                      className="flex-1"
                    />
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      {p.progress}%
                    </span>
                  </div>
                  <Badge variant={p.drivenBy === "human" ? "outline" : "muted"}>
                    {t(`seat.${p.drivenBy}` as const)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Attention + activity ────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <SectionHeader
              title={t("overview.attention")}
              action={
                <Link
                  href="/baseline"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  {t("nav.baseline")} <ArrowRight className="size-3" />
                </Link>
              }
            />
            <Card className="divide-y divide-border">
              {attention.failingGates.map((g) => (
                <AttentionRow
                  key={g.id}
                  icon={<AlertTriangle className="size-3.5 text-[--color-danger]" />}
                  title={`${b({ en: "Gate", zh: "关卡" })} · ${b(g.name)}`}
                  detail={b({
                    en: `Failing: ${g.actual} — threshold ${g.threshold}`,
                    zh: `未通过：当前 ${g.actual}，阈值 ${g.threshold}`,
                  })}
                  href="/baseline"
                />
              ))}
              {attention.blockers.map((q) => (
                <AttentionRow
                  key={q.id}
                  icon={<AlertTriangle className="size-3.5 text-[--color-danger]" />}
                  title={`${q.code} · ${b(q.question)}`}
                  detail={b(q.whyItMatters)}
                  href={`/questions/${q.id}`}
                />
              ))}
              {attention.openFindings.map((f) => (
                <AttentionRow
                  key={f.id}
                  icon={<Layers className="size-3.5 text-[--color-warning]" />}
                  title={`${f.code} · ${b(f.claim)}`}
                  detail={b(f.challenge)}
                  href="/challenge"
                />
              ))}
              {attention.thinScenarios.map((s) => (
                <AttentionRow
                  key={s.id}
                  icon={<FileSearch className="size-3.5 text-[--color-warning]" />}
                  title={`${s.code} · ${b(s.name)}`}
                  detail={b({
                    en: `Source coverage ${s.sourceCoverage}% — below the 70% freeze gate`,
                    zh: `来源覆盖率 ${s.sourceCoverage}%，低于 70% 冻结关卡`,
                  })}
                  href={`/understanding/${s.id}`}
                />
              ))}
            </Card>
          </section>

          <section className="space-y-3">
            <SectionHeader title={t("overview.activity")} />
            <Card className="divide-y divide-border">
              {activity.map((a) => (
                <div key={a.id} className="space-y-1.5 p-3">
                  <div className="flex items-center gap-2">
                    <GitCommitHorizontal className="size-3.5 shrink-0 text-muted-foreground/60" />
                    <code className="font-mono text-[10px] text-muted-foreground">
                      {a.ref}
                    </code>
                    {a.seat ? (
                      <SeatBadge
                        attribution={{ seat: a.seat, model: a.actor, at: a.at }}
                      />
                    ) : (
                      <Badge variant="outline">{a.actor}</Badge>
                    )}
                    <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground/70">
                      {fmtDateTime(a.at)}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed">{b(a.message)}</p>
                  <div className="flex flex-wrap gap-1">
                    {a.files.map((f) => (
                      <RepoPath key={f} path={f} />
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

function Tile({
  label,
  value,
  sub,
  tone,
  href,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
  tone: "success" | "warning" | "danger";
  href: string;
}) {
  const toneClass = {
    success: "text-[--color-success]",
    warning: "text-[--color-warning]",
    danger: "text-[--color-danger]",
  }[tone];
  return (
    <Link href={href} className="focus-visible:outline-none">
      <Card className="h-full p-3 transition-colors hover:border-primary/40">
        <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={`mt-1 font-mono text-2xl tabular-nums ${toneClass}`}>{value}</p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground/80">{sub}</p>
      </Card>
    </Link>
  );
}

function AttentionRow({
  icon,
  title,
  detail,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex gap-2.5 p-3 transition-colors hover:bg-accent/50">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-medium">{title}</span>
        <span className="mt-0.5 block line-clamp-2 text-[11px] text-muted-foreground">
          {detail}
        </span>
      </span>
    </Link>
  );
}
