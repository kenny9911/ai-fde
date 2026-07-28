"use client";

import * as React from "react";
import Link from "next/link";
import { Gavel, Link2, ShieldQuestion } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, EmptyState, SectionHeader } from "@/components/ui";
import { ClaimTriptych } from "@/components/claim-triptych";
import {
  CitationList,
  FindingTypeChip,
  SeatBadge,
  SeverityChip,
  VerdictChip,
} from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { countPhrase, verdictFilterLabel } from "@/lib/labels";
import { findings, getQuestion, labelForRef } from "@/data";
import type { FindingVerdict } from "@/lib/types";

export default function ChallengePage() {
  const t = useT();
  const b = useB();
  const [verdictFilter, setVerdictFilter] = React.useState<FindingVerdict | "all">(
    "all",
  );

  const filtered = React.useMemo(
    () =>
      verdictFilter === "all"
        ? findings
        : findings.filter((f) => f.verdict === verdictFilter),
    [verdictFilter],
  );

  // Grouping by round makes the loop legible: each round should raise fewer
  // findings than the last, and a round that raises more is a signal.
  const byRound = React.useMemo(() => {
    const map = new Map<number, typeof findings>();
    for (const f of filtered) {
      const arr = map.get(f.round) ?? [];
      arr.push(f);
      map.set(f.round, arr);
    }
    return [...map.entries()].sort((a, x) => x[0] - a[0]);
  }, [filtered]);

  const stats = React.useMemo(
    () => ({
      upheld: findings.filter((f) => f.verdict === "upheld").length,
      refuted: findings.filter((f) => f.verdict === "refuted").length,
      open: findings.filter((f) => f.verdict === "open").length,
      needs: findings.filter((f) => f.verdict === "needs-clarification").length,
    }),
    [],
  );

  return (
    <>
      <PageHeader
        icon={<Gavel className="size-4 text-[--color-phase-challenge]" />}
        title={t("challenge.title")}
        subtitle={t("challenge.subtitle")}
        accent="challenge"
        meta={
          <Badge variant="outline" className="font-mono">
            {b(countPhrase.findings(findings.length))}
          </Badge>
        }
      />

      <div className="space-y-6 p-6">
        {/* The refuted count is the credibility check on the challenger
            itself — a challenger that is never wrong saw the answers. */}
        <Card className="grid gap-4 p-4 sm:grid-cols-4">
          <Stat label={b({ en: "Upheld", zh: "质证成立" })} value={stats.upheld} tone="danger" />
          <Stat label={b({ en: "Refuted", zh: "质证不成立" })} value={stats.refuted} tone="success" />
          <Stat label={b({ en: "Open", zh: "未裁定" })} value={stats.open} tone="warning" />
          <Stat
            label={b({ en: "Needs clarification", zh: "需澄清" })}
            value={stats.needs}
            tone="warning"
          />
        </Card>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "open", "upheld", "refuted", "needs-clarification"] as const).map(
            (v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVerdictFilter(v)}
                className={`rounded-md border px-2 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  verdictFilter === v
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {b(verdictFilterLabel[v])}
                <span className="ml-1 font-mono opacity-70">
                  {v === "all"
                    ? findings.length
                    : findings.filter((f) => f.verdict === v).length}
                </span>
              </button>
            ),
          )}
        </div>

        {byRound.length === 0 ? (
          <EmptyState title={t("common.empty")} />
        ) : (
          byRound.map(([round, items]) => (
            <section key={round} className="space-y-3">
              <SectionHeader
                title={`${t("common.round")} ${round}`}
                count={items.length}
              />
              <div className="space-y-3">
                {items.map((f) => {
                  const spawned = f.spawnedQuestionId
                    ? getQuestion(f.spawnedQuestionId)
                    : undefined;
                  return (
                    <Card key={f.id} className="space-y-3 p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <code className="font-mono text-[11px] text-muted-foreground">
                          {f.code}
                        </code>
                        <FindingTypeChip type={f.type} />
                        <SeverityChip severity={f.severity} />
                        <VerdictChip verdict={f.verdict} />
                        <Link href={`/understanding/${f.targetRef.id.split("-").slice(0, 2).join("-")}`}>
                          <Badge variant="outline" className="gap-1 font-mono hover:bg-accent">
                            <Link2 className="size-2.5" />
                            {labelForRef(f.targetRef.id)}
                          </Badge>
                        </Link>
                        <div className="ml-auto flex items-center gap-1.5">
                          <SeatBadge attribution={f.raisedBy} />
                          {f.reviewedBy && <SeatBadge attribution={f.reviewedBy} />}
                        </div>
                      </div>

                      <ClaimTriptych
                        claim={b(f.claim)}
                        challenge={b(f.challenge)}
                        revision={f.revision ? b(f.revision) : undefined}
                      />

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {t("common.citations")}
                          </p>
                          <CitationList citations={f.citations} />
                        </div>
                        {spawned && (
                          <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                              {b({ en: "Escalated to consultant", zh: "已升级为顾问问题" })}
                            </p>
                            <Link
                              href={`/questions/${spawned.id}`}
                              className="flex gap-2 rounded-md border border-border p-2.5 transition-colors hover:bg-accent/50"
                            >
                              <ShieldQuestion className="mt-0.5 size-3.5 shrink-0 text-primary" />
                              <span className="min-w-0">
                                <span className="font-mono text-[11px] text-primary">
                                  {spawned.code}
                                </span>
                                <span className="mt-0.5 block text-[11px] leading-relaxed">
                                  {b(spawned.question)}
                                </span>
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  const toneClass = {
    success: "text-[--color-success]",
    warning: "text-[--color-warning]",
    danger: "text-[--color-danger]",
  }[tone];
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}
