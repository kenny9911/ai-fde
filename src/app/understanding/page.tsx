"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, Layers, ShieldAlert, Users, Workflow } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import {
  Badge,
  Card,
  ConfidenceBar,
  EmptyState,
  Meter,
  SectionHeader,
  Tabs,
} from "@/components/ui";
import { EvidenceChip, ScenarioStatusChip } from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { countPhrase, scenarioFilterLabel, workItemTypeLabel } from "@/lib/labels";
import {
  roles,
  scenarios,
  workItems,
  getRole,
  openQuestionsForScenario,
} from "@/data";
import type { ScenarioStatus } from "@/lib/types";

type View = "scenarios" | "roles" | "workItems";

export default function UnderstandingPage() {
  const t = useT();
  const b = useB();
  const [view, setView] = React.useState<View>("scenarios");
  const [statusFilter, setStatusFilter] = React.useState<ScenarioStatus | "all">(
    "all",
  );

  const filtered = React.useMemo(
    () =>
      statusFilter === "all"
        ? scenarios
        : scenarios.filter((s) => s.status === statusFilter),
    [statusFilter],
  );

  // Group by lifecycle stage so the map reads as a process, not a list.
  const byStage = React.useMemo(() => {
    const map = new Map<string, typeof scenarios>();
    for (const s of filtered) {
      const key = s.stage.en;
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      <PageHeader
        icon={<Workflow className="size-4 text-phase-understand" />}
        title={t("understanding.title")}
        subtitle={t("understanding.subtitle")}
        accent="understand"
        meta={
          <Badge variant="outline" className="font-mono">
            {b(
              countPhrase.understanding(
                scenarios.length,
                roles.length,
                workItems.length,
              ),
            )}
          </Badge>
        }
      />

      <div className="px-6 pt-4">
        <Tabs<View>
          active={view}
          onChange={setView}
          tabs={[
            { id: "scenarios", label: b({ en: "Scenarios", zh: "场景" }), count: scenarios.length },
            { id: "roles", label: t("common.roles"), count: roles.length },
            { id: "workItems", label: t("common.workItems"), count: workItems.length },
          ]}
        />
      </div>

      <div className="space-y-6 p-6">
        {view === "scenarios" && (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["all", "draft", "challenged", "clarifying", "agreed"] as const).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-md border px-2 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      statusFilter === s
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {b(scenarioFilterLabel[s])}
                    <span className="ml-1 font-mono opacity-70">
                      {s === "all"
                        ? scenarios.length
                        : scenarios.filter((x) => x.status === s).length}
                    </span>
                  </button>
                ),
              )}
            </div>

            {byStage.length === 0 ? (
              <EmptyState title={t("common.empty")} />
            ) : (
              byStage.map(([stage, items]) => (
                <section key={stage} className="space-y-3">
                  <SectionHeader
                    title={b(items[0].stage)}
                    count={items.length}
                  />
                  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {items.map((s) => (
                      <Link key={s.id} href={`/understanding/${s.id}`}>
                        <Card className="flex h-full flex-col gap-3 p-4 transition-colors hover:border-primary/40">
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono text-[11px] text-primary">
                              {s.code}
                            </code>
                            <ScenarioStatusChip status={s.status} />
                            <ConfidenceBar value={s.confidence} className="ml-auto" />
                          </div>

                          <div>
                            <h3 className="text-[13px] font-medium leading-snug">
                              {b(s.name)}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                              {b(s.summary)}
                            </p>
                          </div>

                          <div className="mt-auto space-y-2">
                            <div className="flex items-center gap-2">
                              <Meter
                                value={s.sourceCoverage}
                                tone={s.sourceCoverage >= 70 ? "success" : "danger"}
                                className="flex-1"
                              />
                              <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                                {s.sourceCoverage}%
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant="muted" className="gap-1">
                                <Layers className="size-2.5" />
                                {s.steps.length}
                              </Badge>
                              <Badge variant="muted" className="gap-1">
                                <Users className="size-2.5" />
                                {s.roleIds.length}
                              </Badge>
                              {openQuestionsForScenario(s.id).length > 0 && (
                                <Badge variant="info" className="gap-1">
                                  <HelpCircle className="size-2.5" />
                                  {openQuestionsForScenario(s.id).length}
                                </Badge>
                              )}
                              {s.findingIds.length > 0 && (
                                <Badge variant="warning" className="gap-1">
                                  <ShieldAlert className="size-2.5" />
                                  {s.findingIds.length}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}

        {view === "roles" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {roles.map((r) => (
              <Card key={r.id} className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <code className="font-mono text-[11px] text-muted-foreground">
                    {r.id}
                  </code>
                  <h3 className="text-[13px] font-medium">{b(r.name)}</h3>
                  {r.unmappedInErp ? (
                    <Badge variant="warning" className="ml-auto">
                      {b({ en: "No ERP counterpart", zh: "ERP无对应" })}
                    </Badge>
                  ) : (
                    <Badge variant="muted" className="ml-auto font-mono">
                      {r.erpRole}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{b(r.orgUnit)}</p>
                <ul className="space-y-1">
                  {r.responsibilities.map((x, i) => (
                    <li
                      key={i}
                      className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                      {b(x)}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1">
                  {r.scenarioIds.map((id) => (
                    <Link key={id} href={`/understanding/${id}`}>
                      <Badge variant="outline" className="font-mono hover:bg-accent">
                        {id}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {view === "workItems" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {workItems.map((w) => {
              const owner = getRole(w.ownerRoleId);
              return (
                <Card key={w.id} className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <code className="font-mono text-[11px] text-muted-foreground">
                      {w.id}
                    </code>
                    <h3 className="text-[13px] font-medium">{b(w.name)}</h3>
                    <Badge variant="muted" className="ml-auto">
                      {b(workItemTypeLabel[w.type])}
                    </Badge>
                    <EvidenceChip grade={w.evidence} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {b(w.description)}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    {owner && (
                      <Badge variant="outline" className="gap-1">
                        <Users className="size-2.5" />
                        {b(owner.name)}
                      </Badge>
                    )}
                    {w.erpObject ? (
                      <Badge variant="info" className="font-mono">
                        {w.erpObject}
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        {b({ en: "No ERP object", zh: "ERP无对应对象" })}
                      </Badge>
                    )}
                    {w.sla && <span>· {b(w.sla)}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
