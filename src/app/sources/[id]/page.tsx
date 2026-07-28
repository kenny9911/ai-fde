"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Files, Tag } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, EmptyState, RepoPath, SectionHeader } from "@/components/ui";
import { useB, useT } from "@/lib/i18n";
import { fmtDate } from "@/lib/utils";
import { extractionStatusLabel } from "@/lib/labels";
import { getSource, scenariosCiting, uncitedPages } from "@/data";

export default function SourceDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const b = useB();

  const source = getSource(params.id);
  if (!source) notFound();

  const uncited = React.useMemo(() => new Set(uncitedPages(source)), [source]);
  const usedBy = React.useMemo(() => scenariosCiting(source.id), [source.id]);

  return (
    <>
      <PageHeader
        icon={<Files className="size-4 text-phase-ingest" />}
        title={b(source.title)}
        subtitle={`${b(source.provider)} · ${fmtDate(source.receivedAt)}`}
        accent="ingest"
        meta={
          <>
            <code className="font-mono text-[11px] text-muted-foreground">
              {source.id}
            </code>
            <Badge variant={source.status === "extracted" ? "success" : "warning"}>
              {b(extractionStatusLabel[source.status])}
            </Badge>
          </>
        }
        actions={
          <>
            <RepoPath path={source.repoPath} />
            <Link
              href="/sources"
              className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="size-3.5" />
            </Link>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* ── Page-by-page extraction ─────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader
            title={b({ en: "Extracted pages", zh: "已提取页面" })}
            count={source.pages.length}
          />
          <div className="space-y-3">
            {source.pages.map((p) => {
              const unreadable = source.unreadablePages.includes(p.index);
              return (
                <Card
                  key={p.index}
                  id={`p${p.index}`}
                  className={
                    unreadable
                      ? "border-danger/30 bg-danger/5"
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3 p-4">
                    {/* Page chip stands in for the rendered slide thumbnail */}
                    <div
                      className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-md border font-mono text-[10px] ${
                        unreadable
                          ? "border-danger/40 bg-danger/10 text-danger"
                          : "grid-paper border-border bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <span className="text-[9px] opacity-60">p.</span>
                      <span className="text-[13px] tabular-nums">{p.index}</span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-[13px] font-medium">{b(p.title)}</h3>
                        {p.analyzed ? (
                          <Badge variant="success" className="gap-1">
                            <Eye className="size-2.5" />
                            analysed
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <EyeOff className="size-2.5" />
                            {t("sources.unanalysed")}
                          </Badge>
                        )}
                        {uncited.has(p.index) && !unreadable && (
                          <Badge variant="muted">never cited</Badge>
                        )}
                      </div>

                      {p.extractedText ? (
                        <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                          {p.extractedText}
                        </p>
                      ) : (
                        <p className="rounded-md border border-dashed border-danger/30 p-2.5 text-[11px] italic text-danger">
                          {b({
                            en: "No text could be extracted from this page.",
                            zh: "本页无法提取任何文本。",
                          })}
                        </p>
                      )}

                      {p.entities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <Tag className="size-2.5 text-muted-foreground/60" />
                          {p.entities.map((e) => (
                            <Badge key={e} variant="outline">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {p.note && (
                        <div className="flex gap-1.5 rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px] leading-relaxed">
                          <AlertTriangle className="mt-0.5 size-3 shrink-0 text-warning" />
                          <span className="text-muted-foreground">{b(p.note)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Where this source is used ───────────────────────────── */}
        <aside className="space-y-3">
          <SectionHeader
            title={b({ en: "Cited by", zh: "被引用于" })}
            count={usedBy.length}
          />
          {usedBy.length === 0 ? (
            <EmptyState
              title={b({
                en: "No scenario cites this source yet.",
                zh: "尚无场景引用该来源。",
              })}
            />
          ) : (
            <Card className="divide-y divide-border">
              {usedBy.map((s) => (
                <Link
                  key={s.id}
                  href={`/understanding/${s.id}`}
                  className="block p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono text-[11px] text-primary">{s.code}</code>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {s.sourceCoverage}%
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] leading-snug">{b(s.name)}</p>
                </Link>
              ))}
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
