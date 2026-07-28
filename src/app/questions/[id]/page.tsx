"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  CornerDownRight,
  Link2,
  MessageSquareQuote,
  Scale,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, EmptyState, RepoPath, SectionHeader } from "@/components/ui";
import {
  CitationList,
  HumanBadge,
  CategoryChip,
  QuestionStatusChip,
  SeatBadge,
  SeverityChip,
} from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { getQuestion, getSession, labelForRef } from "@/data";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const b = useB();

  const q = getQuestion(params.id);
  if (!q) notFound();

  const session = q.answer?.sessionId ? getSession(q.answer.sessionId) : undefined;

  return (
    <>
      <PageHeader
        icon={<ClipboardList className="size-4 text-[--color-phase-clarify]" />}
        title={b(q.question)}
        accent="clarify"
        meta={
          <>
            <code className="font-mono text-[11px] text-primary">{q.code}</code>
            <SeverityChip severity={q.severity} />
            <QuestionStatusChip status={q.status} />
            <CategoryChip category={q.category} />
            <Badge variant="muted">
              {t("common.round")} {q.round}
            </Badge>
          </>
        }
        actions={
          <>
            <RepoPath path={q.repoPath} />
            <Link
              href="/questions"
              className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="size-3.5" />
            </Link>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          {/* Why it matters — stated as what cannot be modelled. This is the
              field that lets a consultant triage by consequence. */}
          <section className="space-y-2">
            <SectionHeader title={t("questions.why")} />
            <Card className="border-l-2 border-l-[--color-phase-clarify] p-4">
              <p className="text-[12px] leading-relaxed">{b(q.whyItMatters)}</p>
            </Card>
          </section>

          {q.options && q.options.length > 0 && (
            <section className="space-y-2">
              <SectionHeader title={t("questions.options")} count={q.options.length} />
              <div className="grid gap-3 md:grid-cols-2">
                {q.options.map((o, i) => (
                  <Card key={i} className="space-y-1.5 p-3.5">
                    <div className="flex items-start gap-2">
                      <Scale className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" />
                      <p className="text-[12px] font-medium leading-snug">
                        {b(o.label)}
                      </p>
                    </div>
                    <p className="pl-[22px] text-[11px] leading-relaxed text-muted-foreground">
                      {b(o.implication)}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            <SectionHeader title={t("questions.answer")} />
            {q.answer ? (
              <Card className="space-y-3 border-[--color-success]/30 bg-[--color-success]/5 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <MessageSquareQuote className="size-3.5 text-[--color-success]" />
                  <HumanBadge name={q.answer.answeredBy} />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {fmtDate(q.answer.answeredAt)}
                  </span>
                  {session && (
                    <Link href={`/sessions/${session.id}`}>
                      <Badge variant="info" className="font-mono hover:opacity-80">
                        {session.code}
                      </Badge>
                    </Link>
                  )}
                </div>
                <p className="text-[12px] leading-relaxed">{b(q.answer.text)}</p>

                <div>
                  <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("questions.changes")}
                  </p>
                  <ul className="space-y-1">
                    {q.answer.resultingChanges.map((c, i) => (
                      <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed">
                        <CornerDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground/50" />
                        {b(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : (
              <EmptyState
                title={b({
                  en: "Awaiting the consultant.",
                  zh: "等待顾问答复。",
                })}
                hint={b({
                  en: "This question is on the agenda for the next clarification session.",
                  zh: "该问题已排入下次澄清会议议程。",
                })}
              />
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-2">
            <SectionHeader title={t("common.blocks")} count={q.blocks.length} />
            <Card className="divide-y divide-border">
              {q.blocks.map((ref) => (
                <Link
                  key={ref}
                  href={
                    ref.startsWith("PR-") ? `/understanding/${ref}` : "/understanding"
                  }
                  className="flex items-center gap-1.5 p-2.5 transition-colors hover:bg-accent/50"
                >
                  <Link2 className="size-3 shrink-0 text-muted-foreground/60" />
                  <code className="font-mono text-[11px] text-primary">
                    {labelForRef(ref)}
                  </code>
                </Link>
              ))}
            </Card>
          </section>

          <section className="space-y-2">
            <SectionHeader title={t("common.citations")} />
            <Card className="p-3">
              <CitationList citations={q.citations} />
            </Card>
          </section>

          {q.followUpIds.length > 0 && (
            <section className="space-y-2">
              <SectionHeader
                title={t("questions.followUps")}
                count={q.followUpIds.length}
              />
              <Card className="divide-y divide-border">
                {q.followUpIds.map((id) => {
                  const f = getQuestion(id);
                  if (!f) return null;
                  return (
                    <Link
                      key={id}
                      href={`/questions/${id}`}
                      className="block p-2.5 transition-colors hover:bg-accent/50"
                    >
                      <code className="font-mono text-[11px] text-primary">
                        {f.code}
                      </code>
                      <p className="mt-0.5 text-[11px] leading-snug">{b(f.question)}</p>
                    </Link>
                  );
                })}
              </Card>
            </section>
          )}

          <section className="space-y-2">
            <SectionHeader title={t("common.raisedBy")} />
            <Card className="p-3">
              <SeatBadge attribution={q.raisedBy} />
              <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                {fmtDate(q.raisedBy.at)}
              </p>
            </Card>
          </section>
        </aside>
      </div>
    </>
  );
}
