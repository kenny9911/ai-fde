"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Files,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Mic,
  Presentation,
  Database,
} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, Meter, RepoPath, SectionHeader } from "@/components/ui";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { countPhrase, extractionStatusLabel } from "@/lib/labels";
import { computeMetrics, scenariosCiting, sources, uncitedPages } from "@/data";
import type { SourceKind } from "@/lib/types";

const kindIcon: Record<SourceKind, React.ComponentType<{ className?: string }>> = {
  deck: Presentation,
  transcript: Mic,
  screenshot: ImageIcon,
  document: FileText,
  "system-export": Database,
  spreadsheet: FileSpreadsheet,
};

const kindLabel: Record<SourceKind, { en: string; zh: string }> = {
  deck: { en: "Deck", zh: "演示文稿" },
  transcript: { en: "Transcript", zh: "口水稿" },
  screenshot: { en: "Screens", zh: "页面截图" },
  document: { en: "Document", zh: "文档" },
  "system-export": { en: "System export", zh: "系统导出" },
  spreadsheet: { en: "Spreadsheet", zh: "表格" },
};

export default function SourcesPage() {
  const t = useT();
  const b = useB();
  const m = React.useMemo(() => computeMetrics(), []);

  return (
    <>
      <PageHeader
        icon={<Files className="size-4 text-phase-ingest" />}
        title={t("sources.title")}
        subtitle={t("sources.subtitle")}
        accent="ingest"
        meta={
          <Badge variant="outline" className="font-mono">
            {b(
              countPhrase.sources(
                sources.length,
                sources.reduce((n, s) => n + s.pages.length, 0),
              ),
            )}
          </Badge>
        }
      />

      <div className="space-y-6 p-6">
        {/* Completeness check — the extractor's own honesty report. */}
        <section className="space-y-3">
          <SectionHeader title={t("sources.completeness")} />
          <Card className="grid gap-4 p-4 sm:grid-cols-3">
            <CompletenessStat
              label={t("sources.unreadable")}
              value={m.unreadablePages}
              tone={m.unreadablePages > 0 ? "danger" : "success"}
              note={
                b({
                  en: "Pages the extractor could not read at all. Each one is a hole in the analysis.",
                  zh: "提取环节完全无法识别的页面。每一页都是分析中的一个空洞。",
                })
              }
            />
            <CompletenessStat
              label={t("sources.unanalysed")}
              value={m.unanalysedPages}
              tone={m.unanalysedPages > 0 ? "warning" : "success"}
              note={b({
                en: "Extracted successfully but never consumed by the analyst pass.",
                zh: "提取成功但分析环节尚未消费的页面。",
              })}
            />
            <CompletenessStat
              label={b({ en: "Never cited", zh: "从未被引用" })}
              value={sources.reduce((n, s) => n + uncitedPages(s).length, 0)}
              tone="warning"
              note={b({
                en: "Pages no scenario, question or finding points at. Either irrelevant, or missed.",
                zh: "没有任何场景、问题或发现引用的页面。要么无关，要么被遗漏。",
              })}
            />
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title={t("sources.title")} count={sources.length} />
          <div className="grid gap-3 lg:grid-cols-2">
            {sources.map((s) => {
              const Icon = kindIcon[s.kind];
              const analysed = s.pages.filter((p) => p.analyzed).length;
              const pct = Math.round((analysed / s.pages.length) * 100);
              const usedBy = scenariosCiting(s.id);
              return (
                <Link key={s.id} href={`/sources/${s.id}`}>
                  <Card className="h-full space-y-3 p-4 transition-colors hover:border-primary/40">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ring-1 ring-border">
                        <Icon className="size-3.5 text-phase-ingest" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <code className="font-mono text-[11px] text-muted-foreground">
                            {s.id}
                          </code>
                          <Badge variant="muted">{b(kindLabel[s.kind])}</Badge>
                          {s.status === "partial" && (
                            <Badge variant="warning" className="gap-1">
                              <AlertTriangle className="size-2.5" />
                              {b(extractionStatusLabel[s.status])}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-[13px] font-medium leading-snug">
                          {b(s.title)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {b(s.provider)} · {fmtDate(s.receivedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Meter
                        value={pct}
                        tone={pct === 100 ? "success" : "warning"}
                        className="flex-1"
                      />
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                        {b(countPhrase.analysed(analysed, s.pages.length))}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {s.unreadablePages.length > 0 && (
                        <Badge variant="danger" className="gap-1">
                          <AlertTriangle className="size-2.5" />
                          {b(countPhrase.unreadable(s.unreadablePages.length))}
                        </Badge>
                      )}
                      {usedBy.length > 0 && (
                        <Badge variant="info">
                          {b(countPhrase.citedBy(usedBy.length))}
                        </Badge>
                      )}
                      <RepoPath path={s.repoPath} className="ml-auto" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function CompletenessStat({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
  note: string;
}) {
  const toneClass = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }[tone];
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl tabular-nums ${toneClass}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/80">
        {note}
      </p>
    </div>
  );
}
