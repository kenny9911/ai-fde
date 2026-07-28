"use client";

import * as React from "react";
import Link from "next/link";
import { ClipboardList, Link2 } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, SectionHeader } from "@/components/ui";
import { CategoryChip, SeatBadge, SeverityChip } from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { categoryLabel, countPhrase } from "@/lib/labels";
import { labelForRef, questions } from "@/data";
import type { QuestionCategory, QuestionStatus } from "@/lib/types";

const COLUMNS: Array<{ id: QuestionStatus; label: { en: string; zh: string } }> = [
  { id: "draft", label: { en: "Draft", zh: "草拟" } },
  { id: "asked", label: { en: "Asked", zh: "已提问" } },
  { id: "answered", label: { en: "Answered", zh: "已答复" } },
  { id: "resolved", label: { en: "Resolved", zh: "已闭环" } },
  { id: "deferred", label: { en: "Deferred", zh: "已搁置" } },
];

const CATEGORIES: QuestionCategory[] = [
  "process-gap",
  "data-definition",
  "authority",
  "exception-path",
  "integration",
  "compliance",
  "scope",
];

export default function QuestionsPage() {
  const t = useT();
  const b = useB();
  const [category, setCategory] = React.useState<QuestionCategory | "all">("all");
  const [blockersOnly, setBlockersOnly] = React.useState(false);

  const filtered = React.useMemo(
    () =>
      questions.filter(
        (q) =>
          (category === "all" || q.category === category) &&
          (!blockersOnly || q.severity === "blocker"),
      ),
    [category, blockersOnly],
  );

  return (
    <>
      <PageHeader
        icon={<ClipboardList className="size-4 text-phase-clarify" />}
        title={t("questions.title")}
        subtitle={t("questions.subtitle")}
        accent="clarify"
        meta={
          <>
            <Badge variant="outline" className="font-mono">
              {b(countPhrase.total(questions.length))}
            </Badge>
            <Badge variant="danger">
              {b(
                countPhrase.openBlockers(
                  questions.filter(
                    (q) =>
                      q.severity === "blocker" &&
                      (q.status === "asked" || q.status === "draft"),
                  ).length,
                ),
              )}
            </Badge>
          </>
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={chipClass(category === "all")}
          >
            {t("common.all")}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={chipClass(category === c)}
            >
              {b(categoryLabel[c])}
              <span className="ml-1 font-mono opacity-70">
                {questions.filter((q) => q.category === c).length}
              </span>
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <button
            type="button"
            onClick={() => setBlockersOnly((v) => !v)}
            className={chipClass(blockersOnly)}
          >
            {b({ en: "Blockers only", zh: "仅阻断级" })}
          </button>
        </div>

        {/* Board — status columns, because this is a queue a human works. */}
        <div className="grid gap-3 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = filtered.filter((q) => q.status === col.id);
            return (
              <section key={col.id} className="flex min-w-0 flex-col gap-2">
                <SectionHeader title={b(col.label)} count={items.length} />
                <div className="flex flex-col gap-2">
                  {items.map((q) => (
                    <Link key={q.id} href={`/questions/${q.id}`}>
                      <Card className="space-y-2 p-3 transition-colors hover:border-primary/40">
                        <div className="flex flex-wrap items-center gap-1">
                          <code className="font-mono text-[10px] text-primary">
                            {q.code}
                          </code>
                          <SeverityChip severity={q.severity} />
                          <Badge variant="muted" className="ml-auto">
                            R{q.round}
                          </Badge>
                        </div>
                        <p className="line-clamp-3 text-[12px] font-medium leading-snug">
                          {b(q.question)}
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                          <CategoryChip category={q.category} />
                          {q.blocks.slice(0, 2).map((ref) => (
                            <Badge key={ref} variant="muted" className="gap-1 font-mono">
                              <Link2 className="size-2.5" />
                              {labelForRef(ref)}
                            </Badge>
                          ))}
                        </div>
                        <SeatBadge attribution={q.raisedBy} showModel={false} />
                      </Card>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground/60">
                      —
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

function chipClass(active: boolean) {
  return `rounded-md border px-2 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    active
      ? "border-primary/40 bg-primary/10 text-primary"
      : "border-border text-muted-foreground hover:bg-accent"
  }`;
}
