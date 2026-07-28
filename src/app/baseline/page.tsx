"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  MinusCircle,
  PauseCircle,
  XCircle,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import {
  Badge,
  Button,
  Card,
  Meter,
  RepoPath,
  SectionHeader,
} from "@/components/ui";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { countPhrase, scopeDecisionLabel } from "@/lib/labels";
import { baseline, computeMetrics, labelForRef } from "@/data";
import type { GateCheck, ScopeDecision } from "@/lib/types";

export default function BaselinePage() {
  const t = useT();
  const b = useB();
  const m = React.useMemo(() => computeMetrics(), []);

  const failing = baseline.gates.filter((g) => g.status === "fail");
  const canFreeze = failing.length === 0;

  return (
    <>
      <PageHeader
        icon={<Lock className="size-4 text-phase-baseline" />}
        title={t("baseline.title")}
        subtitle={t("baseline.subtitle")}
        accent="baseline"
        meta={
          <>
            <Badge variant="outline" className="font-mono">
              {baseline.version}
            </Badge>
            <Badge variant={baseline.status === "frozen" ? "success" : "warning"}>
              {b(
                baseline.status === "frozen"
                  ? { en: "Frozen", zh: "已冻结" }
                  : baseline.status === "ready-to-freeze"
                    ? { en: "Ready to freeze", zh: "可冻结" }
                    : { en: "Open", zh: "进行中" },
              )}
            </Badge>
          </>
        }
        actions={
          <>
            <RepoPath path={baseline.repoPath} />
            <Button
              variant={canFreeze ? "agent" : "outline"}
              disabled={!canFreeze}
              title={
                canFreeze
                  ? undefined
                  : b({
                      en: "Gates are failing — resolve them before freezing.",
                      zh: "存在未通过的关卡，需先解决后方可冻结。",
                    })
              }
            >
              <Lock className="size-3" />
              {b({ en: "Freeze baseline", zh: "冻结基线" })}
            </Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        {/* Readiness — a single honest number, derived from the gates below
            rather than asserted independently of them. */}
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("baseline.readiness")}
            </span>
            <span
              className={`font-mono text-2xl tabular-nums ${
                m.baselineReadiness >= 80
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {m.baselineReadiness}%
            </span>
            <Meter
              value={m.baselineReadiness}
              tone={m.baselineReadiness >= 80 ? "success" : "danger"}
              className="max-w-sm flex-1"
            />
            <span className="font-mono text-[11px] text-muted-foreground">
              {b(
                countPhrase.gatesPassing(
                  baseline.gates.filter((g) => g.status === "pass").length,
                  baseline.gates.length,
                ),
              )}
            </span>
          </div>

          {!canFreeze && (
            <div className="flex gap-2 rounded-md border border-danger/30 bg-danger/5 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
              <div>
                <p className="text-[12px] font-medium text-danger">
                  {t("baseline.blocked")}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {t("baseline.blockedNote")}
                </p>
              </div>
            </div>
          )}
        </Card>

        <section className="space-y-3">
          <SectionHeader title={t("baseline.gates")} count={baseline.gates.length} />
          <div className="space-y-2">
            {baseline.gates.map((g) => (
              <GateRow key={g.id} gate={g} />
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <SectionHeader title={t("baseline.scope")} count={baseline.scope.length} />
            <Card className="divide-y divide-border">
              {baseline.scope.map((s) => (
                <ScopeRow key={s.id} decision={s} />
              ))}
            </Card>
          </section>

          <section className="space-y-3">
            <SectionHeader
              title={t("baseline.signoff")}
              count={baseline.signedOffBy.length}
            />
            <Card className="divide-y divide-border">
              {baseline.signedOffBy.map((p) => (
                <div key={p.name} className="flex items-center gap-2 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{b(p.role)}</p>
                  </div>
                  {p.at ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-2.5" />
                      {fmtDate(p.at)}
                    </Badge>
                  ) : (
                    <Badge variant="muted">
                      {b({ en: "Pending", zh: "待签署" })}
                    </Badge>
                  )}
                </div>
              ))}
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

function GateRow({ gate }: { gate: GateCheck }) {
  const b = useB();
  const Icon =
    gate.status === "pass"
      ? CheckCircle2
      : gate.status === "warn"
        ? AlertTriangle
        : XCircle;
  const tone =
    gate.status === "pass"
      ? "text-success"
      : gate.status === "warn"
        ? "text-warning"
        : "text-danger";
  const border =
    gate.status === "pass"
      ? "border-border"
      : gate.status === "warn"
        ? "border-warning/30"
        : "border-danger/30";

  return (
    <Card className={`space-y-2 p-3.5 ${border}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Icon className={`size-4 shrink-0 ${tone}`} />
        <span className="text-[12px] font-medium">{b(gate.name)}</span>
        <code className="ml-auto rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
          {b(gate.actual)} / {b(gate.threshold)}
        </code>
      </div>
      <p className="pl-6 text-[11px] leading-relaxed text-muted-foreground">
        {b(gate.rationale)}
      </p>
      {gate.offenders.length > 0 && (
        <div className="flex flex-wrap gap-1 pl-6">
          {gate.offenders.map((o) => (
            <OffenderLink key={o} id={o} />
          ))}
        </div>
      )}
    </Card>
  );
}

/** Every failing gate links straight to the thing that is failing it. */
function OffenderLink({ id }: { id: string }) {
  // Findings, source pages and capabilities have no page of their own, so they
  // deep-link to an anchor on the board that holds them — a gate that only got
  // you to the right list would still leave you hunting.
  let href = "/understanding";
  if (id.startsWith("Q-")) href = `/questions/${id}`;
  else if (id.startsWith("PR-")) href = `/understanding/${id}`;
  else if (id.startsWith("C-")) href = `/challenge#${id}`;
  else if (id.startsWith("SRC-")) {
    const [src, page] = id.split(":");
    href = page ? `/sources/${src}#p${page}` : `/sources/${src}`;
  } else if (id.includes(".")) href = `/capabilities#${id}`;

  return (
    <Link href={href}>
      <Badge variant="outline" className="font-mono hover:bg-accent">
        {id.includes(":") || id.includes(".") ? id : labelForRef(id)}
      </Badge>
    </Link>
  );
}

function ScopeRow({ decision }: { decision: ScopeDecision }) {
  const b = useB();
  const Icon =
    decision.decision === "in"
      ? CheckCircle2
      : decision.decision === "out"
        ? MinusCircle
        : PauseCircle;
  const tone =
    decision.decision === "in"
      ? "text-success"
      : decision.decision === "out"
        ? "text-muted-foreground"
        : "text-warning";

  return (
    <div className="flex gap-2.5 p-3">
      <Icon className={`mt-0.5 size-3.5 shrink-0 ${tone}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-medium">{b(decision.item)}</p>
          <Badge
            variant={
              decision.decision === "in"
                ? "success"
                : decision.decision === "deferred"
                  ? "warning"
                  : "muted"
            }
            className="ml-auto"
          >
            {b(scopeDecisionLabel[decision.decision])}
          </Badge>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          {b(decision.rationale)}
        </p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
          {decision.decidedBy} · {fmtDate(decision.decidedAt)}
        </p>
      </div>
    </div>
  );
}
