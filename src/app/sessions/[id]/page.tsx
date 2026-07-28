"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  GitBranch,
  Minus,
  Plus,
  Quote,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, EmptyState, RepoPath, SectionHeader } from "@/components/ui";
import { QuestionStatusChip, SeverityChip } from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { sessionStatusLabel } from "@/lib/labels";
import { getQuestion, getSession } from "@/data";

const deltaIcon = {
  added: Plus,
  changed: RefreshCw,
  removed: Minus,
  confirmed: CheckCircle2,
} as const;

const deltaTone = {
  added: "text-success",
  changed: "text-warning",
  removed: "text-danger",
  confirmed: "text-info",
} as const;

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const b = useB();

  const s = getSession(params.id);
  if (!s) notFound();

  const agenda = s.agendaQuestionIds.map(getQuestion).filter(Boolean);
  const spawned = s.spawnedQuestionIds.map(getQuestion).filter(Boolean);

  return (
    <>
      <PageHeader
        icon={<GitBranch className="size-4 text-phase-clarify" />}
        title={b(s.title)}
        accent="clarify"
        meta={
          <>
            <code className="font-mono text-[11px] text-primary">{s.code}</code>
            <Badge variant="muted" className="gap-1">
              <CalendarClock className="size-2.5" />
              {fmtDate(s.date)} · {s.durationMinutes}m
            </Badge>
            <Badge variant={s.status === "written-up" ? "success" : "muted"}>
              {b(sessionStatusLabel[s.status])}
            </Badge>
            <Badge variant="muted">
              {t("common.round")} {s.round}
            </Badge>
          </>
        }
        actions={
          <>
            <RepoPath path={s.repoPath} />
            <Link
              href="/sessions"
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
          {/* Verbatim excerpts, bound to the question each one answers. The
              messy spoken version is the evidence; the tidy summary is not. */}
          <section className="space-y-2">
            <SectionHeader
              title={t("sessions.transcript")}
              count={s.transcriptExcerpts.length}
            />
            {s.transcriptExcerpts.length === 0 ? (
              <EmptyState
                title={b({
                  en: "Session has not been held yet.",
                  zh: "会议尚未召开。",
                })}
              />
            ) : (
              <div className="space-y-3">
                {s.transcriptExcerpts.map((e, i) => {
                  const q = e.answersQuestionId
                    ? getQuestion(e.answersQuestionId)
                    : undefined;
                  return (
                    <Card key={i} className="space-y-2 p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">{e.speaker}</Badge>
                        <code className="font-mono text-[10px] text-muted-foreground">
                          {e.at}
                        </code>
                        {q && (
                          <Link href={`/questions/${q.id}`} className="ml-auto">
                            <Badge variant="info" className="font-mono hover:opacity-80">
                              {b({ en: "answers", zh: "答复" })} {q.code}
                            </Badge>
                          </Link>
                        )}
                      </div>
                      <blockquote className="flex gap-2 border-l-2 border-phase-clarify/40 pl-3">
                        <Quote className="mt-0.5 size-3 shrink-0 text-muted-foreground/40" />
                        <p className="text-[12px] leading-relaxed">{b(e.text)}</p>
                      </blockquote>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <SectionHeader title={t("sessions.deltas")} count={s.deltas.length} />
            {s.deltas.length === 0 ? (
              <EmptyState title={t("common.empty")} />
            ) : (
              <Card className="divide-y divide-border">
                {s.deltas.map((d, i) => {
                  const Icon = deltaIcon[d.kind];
                  return (
                    <div key={i} className="flex gap-2.5 p-3">
                      <Icon className={`mt-0.5 size-3.5 shrink-0 ${deltaTone[d.kind]}`} />
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium">{b(d.target)}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          {b(d.detail)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-2">
            <SectionHeader
              title={t("sessions.participants")}
              count={s.participants.length}
            />
            <Card className="divide-y divide-border">
              {s.participants.map((p) => (
                <div key={p.name} className="p-2.5">
                  <p className="text-[12px] font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {b(p.role)} · {b(p.org)}
                  </p>
                </div>
              ))}
            </Card>
          </section>

          <section className="space-y-2">
            <SectionHeader title={t("sessions.agenda")} count={agenda.length} />
            <Card className="divide-y divide-border">
              {agenda.map((q) => (
                <Link
                  key={q!.id}
                  href={`/questions/${q!.id}`}
                  className="block space-y-1 p-2.5 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono text-[11px] text-primary">{q!.code}</code>
                    <SeverityChip severity={q!.severity} />
                    <QuestionStatusChip status={q!.status} />
                  </div>
                  <p className="line-clamp-2 text-[11px] leading-snug">
                    {b(q!.question)}
                  </p>
                </Link>
              ))}
            </Card>
          </section>

          {spawned.length > 0 && (
            <section className="space-y-2">
              <SectionHeader title={t("sessions.spawned")} count={spawned.length} />
              <Card className="divide-y divide-border">
                {spawned.map((q) => (
                  <Link
                    key={q!.id}
                    href={`/questions/${q!.id}`}
                    className="block p-2.5 transition-colors hover:bg-accent/50"
                  >
                    <code className="font-mono text-[11px] text-primary">{q!.code}</code>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug">
                      {b(q!.question)}
                    </p>
                  </Link>
                ))}
              </Card>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
