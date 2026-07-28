"use client";

import Link from "next/link";
import { CalendarClock, GitBranch, Users } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, RepoPath, SectionHeader } from "@/components/ui";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { countPhrase, sessionStatusLabel } from "@/lib/labels";
import { sessions } from "@/data";

export default function SessionsPage() {
  const t = useT();
  const b = useB();

  return (
    <>
      <PageHeader
        icon={<GitBranch className="size-4 text-[--color-phase-clarify]" />}
        title={t("sessions.title")}
        subtitle={t("sessions.subtitle")}
        accent="clarify"
        meta={
          <Badge variant="outline" className="font-mono">
            {b(countPhrase.sessions(sessions.length))}
          </Badge>
        }
      />

      <div className="space-y-3 p-6">
        <SectionHeader title={t("sessions.title")} count={sessions.length} />
        <div className="space-y-3">
          {sessions.map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`}>
              <Card className="space-y-3 p-4 transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-center gap-1.5">
                  <code className="font-mono text-[11px] text-primary">{s.code}</code>
                  <h3 className="text-[13px] font-medium">{b(s.title)}</h3>
                  <Badge
                    variant={
                      s.status === "written-up"
                        ? "success"
                        : s.status === "held"
                          ? "info"
                          : "muted"
                    }
                  >
                    {b(sessionStatusLabel[s.status])}
                  </Badge>
                  <Badge variant="muted" className="ml-auto gap-1">
                    <CalendarClock className="size-2.5" />
                    {fmtDate(s.date)} · {s.durationMinutes}m
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Users className="size-3 text-muted-foreground/60" />
                  {s.participants.map((p) => (
                    <Badge key={p.name} variant="outline">
                      {p.name}
                      <span className="opacity-60"> · {b(p.role)}</span>
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span>
                    {t("sessions.agenda")}{" "}
                    <span className="font-mono text-foreground">
                      {s.agendaQuestionIds.length}
                    </span>
                  </span>
                  <span>
                    {t("sessions.answered")}{" "}
                    <span className="font-mono text-[--color-success]">
                      {s.answeredQuestionIds.length}
                    </span>
                  </span>
                  <span>
                    {t("sessions.spawned")}{" "}
                    <span className="font-mono text-[--color-warning]">
                      {s.spawnedQuestionIds.length}
                    </span>
                  </span>
                  <RepoPath path={s.repoPath} className="ml-auto" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
