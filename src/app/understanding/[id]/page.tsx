"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  CornerDownRight,
  GitBranch,
  Plug,
  Workflow,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import {
  Badge,
  Card,
  ConfidenceBar,
  EmptyState,
  Meter,
  RepoPath,
  SectionHeader,
  Tabs,
} from "@/components/ui";
import {
  CitationList,
  EvidenceChip,
  FindingTypeChip,
  ScenarioStatusChip,
  SeatBadge,
  SeverityChip,
  QuestionStatusChip,
  VerdictChip,
} from "@/components/chips";
import { ClaimTriptych } from "@/components/claim-triptych";
import { useB, useT } from "@/lib/i18n";
import {
  findingsForScenario,
  getCapability,
  getRole,
  getScenario,
  getWorkItem,
  openQuestionsForScenario,
} from "@/data";

type Tab = "flow" | "evidence" | "questions" | "challenge";

export default function ScenarioDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const b = useB();
  const [tab, setTab] = React.useState<Tab>("flow");

  const scenario = getScenario(params.id);
  if (!scenario) notFound();

  const questions = React.useMemo(
    () => openQuestionsForScenario(scenario.id),
    [scenario.id],
  );
  const findings = React.useMemo(
    () => findingsForScenario(scenario.id),
    [scenario.id],
  );

  return (
    <>
      <PageHeader
        icon={<Workflow className="size-4 text-phase-understand" />}
        title={b(scenario.name)}
        subtitle={b(scenario.summary)}
        accent="understand"
        meta={
          <>
            <code className="font-mono text-[11px] text-primary">{scenario.code}</code>
            <ScenarioStatusChip status={scenario.status} />
            <ConfidenceBar value={scenario.confidence} />
            <SeatBadge attribution={scenario.attribution} />
          </>
        }
        actions={
          <>
            <RepoPath path={scenario.repoPath} />
            <Link
              href="/understanding"
              className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="size-3.5" />
            </Link>
          </>
        }
      />

      {/* Trigger → outcome strip: the scenario's contract in one line. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-6 py-2.5 text-[11px]">
        <span className="text-muted-foreground">
          {b({ en: "Trigger", zh: "触发" })}
        </span>
        <span className="font-medium">{b(scenario.trigger)}</span>
        <ArrowRight className="size-3 text-muted-foreground/50" />
        <span className="text-muted-foreground">
          {b({ en: "Outcome", zh: "结果" })}
        </span>
        <span className="font-medium">{b(scenario.outcome)}</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground">{t("common.coverage")}</span>
          <Meter
            value={scenario.sourceCoverage}
            tone={scenario.sourceCoverage >= 70 ? "success" : "danger"}
            className="w-24"
          />
          <span className="font-mono tabular-nums">{scenario.sourceCoverage}%</span>
        </span>
      </div>

      <div className="px-6 pt-4">
        <Tabs<Tab>
          active={tab}
          onChange={setTab}
          tabs={[
            { id: "flow", label: t("common.steps"), count: scenario.steps.length },
            { id: "evidence", label: t("common.evidence") },
            { id: "questions", label: t("common.openQuestions"), count: questions.length },
            { id: "challenge", label: t("common.findings"), count: findings.length },
          ]}
        />
      </div>

      <div className="space-y-6 p-6">
        {tab === "flow" && (
          <>
            {/* ── Reconstructed workflow ──────────────────────────── */}
            <section className="space-y-3">
              <SectionHeader
                title={b({ en: "Reconstructed workflow", zh: "还原的工作流" })}
                count={scenario.steps.length}
              />
              <ol className="space-y-2">
                {scenario.steps.map((step, i) => {
                  const actor = getRole(step.actorRoleId);
                  const cap = step.capabilityId
                    ? getCapability(step.capabilityId)
                    : undefined;
                  return (
                    <li key={step.id} className="relative">
                      {i < scenario.steps.length - 1 && (
                        <span
                          className="absolute left-[15px] top-[38px] h-[calc(100%-30px)] w-px bg-border"
                          aria-hidden
                        />
                      )}
                      <Card className="flex gap-3 p-3.5">
                        <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] tabular-nums text-muted-foreground">
                          {step.seq}
                        </span>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="text-[13px] font-medium">{b(step.name)}</h3>
                            <EvidenceChip grade={step.evidence} />
                            <ConfidenceBar value={step.confidence} />
                          </div>

                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            {b(step.description)}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {actor && (
                              <Badge variant="outline">{b(actor.name)}</Badge>
                            )}
                            {step.consumes.map((w) => {
                              const item = getWorkItem(w);
                              return (
                                <Badge key={`c-${w}`} variant="muted" className="gap-1">
                                  <ArrowRight className="size-2.5 rotate-180" />
                                  {item ? b(item.name) : w}
                                </Badge>
                              );
                            })}
                            {step.produces.map((w) => {
                              const item = getWorkItem(w);
                              return (
                                <Badge key={`p-${w}`} variant="info" className="gap-1">
                                  <ArrowRight className="size-2.5" />
                                  {item ? b(item.name) : w}
                                </Badge>
                              );
                            })}
                            {cap && (
                              <Link href="/capabilities">
                                <Badge variant="agent" className="gap-1 font-mono hover:opacity-80">
                                  <Plug className="size-2.5" />
                                  {cap.id}
                                </Badge>
                              </Link>
                            )}
                          </div>

                          {step.branches && step.branches.length > 0 && (
                            <div className="space-y-1 rounded-md border border-dashed border-border p-2">
                              {step.branches.map((br, j) => (
                                <div
                                  key={j}
                                  className="flex items-center gap-1.5 text-[11px]"
                                >
                                  <GitBranch className="size-2.5 text-muted-foreground/60" />
                                  <span className="text-muted-foreground">
                                    {b(br.condition)}
                                  </span>
                                  <CornerDownRight className="size-2.5 text-muted-foreground/40" />
                                  <code className="font-mono text-[10px] text-muted-foreground">
                                    {br.toStepId}
                                  </code>
                                </div>
                              ))}
                            </div>
                          )}

                          {step.citations.length > 0 && (
                            <CitationList citations={step.citations} />
                          )}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* ── Variants ────────────────────────────────────────── */}
            {scenario.variants.length > 0 && (
              <section className="space-y-3">
                <SectionHeader
                  title={t("common.variants")}
                  count={scenario.variants.length}
                />
                <div className="grid gap-3 lg:grid-cols-2">
                  {scenario.variants.map((v, i) => (
                    <Card key={i} className="space-y-1.5 p-3.5">
                      <div className="flex items-center gap-1.5">
                        {v.confirmed ? (
                          <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                        ) : (
                          <CircleDashed className="size-3.5 shrink-0 text-warning" />
                        )}
                        <h3 className="text-[12px] font-medium">{b(v.name)}</h3>
                        <Badge
                          variant={v.confirmed ? "success" : "warning"}
                          className="ml-auto"
                        >
                          {v.confirmed
                            ? b({ en: "Confirmed", zh: "已确认" })
                            : b({ en: "Unconfirmed", zh: "未确认" })}
                        </Badge>
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {b(v.note)}
                      </p>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {tab === "evidence" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-3">
              <SectionHeader title={t("common.citations")} />
              <Card className="p-4">
                <CitationList citations={scenario.citations} />
              </Card>
            </section>
            <section className="space-y-3">
              <SectionHeader title={t("common.roles")} count={scenario.roleIds.length} />
              <Card className="divide-y divide-border">
                {scenario.roleIds.map((id) => {
                  const r = getRole(id);
                  if (!r) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 p-3">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {r.id}
                      </code>
                      <span className="text-[12px]">{b(r.name)}</span>
                      {r.unmappedInErp && (
                        <Badge variant="warning" className="ml-auto">
                          {b({ en: "No ERP counterpart", zh: "ERP无对应" })}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </Card>
            </section>
          </div>
        )}

        {tab === "questions" && (
          <section className="space-y-3">
            {questions.length === 0 ? (
              <EmptyState
                title={b({
                  en: "No open questions block this scenario.",
                  zh: "无阻塞该场景的未决问题。",
                })}
              />
            ) : (
              <Card className="divide-y divide-border">
                {questions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/questions/${q.id}`}
                    className="block space-y-1.5 p-3.5 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <code className="font-mono text-[11px] text-primary">{q.code}</code>
                      <SeverityChip severity={q.severity} />
                      <QuestionStatusChip status={q.status} />
                      <Badge variant="muted" className="ml-auto">
                        {t("common.round")} {q.round}
                      </Badge>
                    </div>
                    <p className="text-[12px] font-medium leading-snug">
                      {b(q.question)}
                    </p>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {b(q.whyItMatters)}
                    </p>
                  </Link>
                ))}
              </Card>
            )}
          </section>
        )}

        {tab === "challenge" && (
          <section className="space-y-3">
            {findings.length === 0 ? (
              <EmptyState
                title={b({
                  en: "The challenger raised nothing against this scenario.",
                  zh: "质证环节未对该场景提出发现。",
                })}
              />
            ) : (
              <div className="space-y-3">
                {findings.map((f) => (
                  <Card key={f.id} className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {f.code}
                      </code>
                      <FindingTypeChip type={f.type} />
                      <SeverityChip severity={f.severity} />
                      <VerdictChip verdict={f.verdict} />
                      <SeatBadge attribution={f.raisedBy} className="ml-auto" />
                    </div>
                    <ClaimTriptych
                      claim={b(f.claim)}
                      challenge={b(f.challenge)}
                      revision={f.revision ? b(f.revision) : undefined}
                    />
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
