"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, Layers, Plug, Server } from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Badge, Card, Meter, SectionHeader } from "@/components/ui";
import { BindingChip, CitationList } from "@/components/chips";
import { useB, useT } from "@/lib/i18n";
import { countPhrase } from "@/lib/labels";
import { capabilities, getQuestion, getScenario } from "@/data";
import type { BindingStatus } from "@/lib/types";

const ORDER: BindingStatus[] = [
  "gap",
  "custom-required",
  "manual-today",
  "partial",
  "bound",
];

export default function CapabilitiesPage() {
  const t = useT();
  const b = useB();

  const grouped = React.useMemo(() => {
    return ORDER.map((status) => ({
      status,
      items: capabilities.filter((c) => c.binding.status === status),
    })).filter((g) => g.items.length > 0);
  }, []);

  const bound = capabilities.filter((c) => c.binding.status === "bound").length;
  const coverage = Math.round((bound / capabilities.length) * 100);

  return (
    <>
      <PageHeader
        icon={<Plug className="size-4 text-phase-understand" />}
        title={t("capabilities.title")}
        subtitle={t("capabilities.subtitle")}
        accent="understand"
        meta={
          <Badge variant="outline" className="font-mono">
            {b(countPhrase.capabilities(capabilities.length))}
          </Badge>
        }
      />

      <div className="space-y-6 p-6">
        {/* The abstraction is the product claim: the ontology calls a
            capability, and only this layer knows it lands on metaERP. */}
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <Badge variant="agent" className="gap-1">
              <Layers className="size-2.5" />
              {b({ en: "Ontology", zh: "本体" })}
            </Badge>
            <span className="text-muted-foreground/50">→</span>
            <Badge variant="info" className="gap-1">
              <Plug className="size-2.5" />
              {b({ en: "Abstraction API", zh: "抽象 API" })}
            </Badge>
            <span className="text-muted-foreground/50">→</span>
            <Badge variant="muted" className="gap-1">
              <Server className="size-2.5" />
              Huawei metaERP
            </Badge>
            <span className="ml-auto flex items-center gap-2">
              <span className="text-muted-foreground">
                {b({ en: "Fully bound", zh: "完全绑定" })}
              </span>
              <Meter
                value={coverage}
                tone={coverage >= 80 ? "success" : "warning"}
                className="w-28"
              />
              <span className="font-mono tabular-nums">
                {bound}/{capabilities.length}
              </span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {b({
              en: "Capability names are platform-neutral by design. If metaERP is replaced, this table changes and the ontology does not.",
              zh: "能力命名刻意与平台无关。若更换 metaERP，变更的是这张表，而非本体本身。",
            })}
          </p>
        </Card>

        {grouped.map((g) => (
          <section key={g.status} className="space-y-3">
            <SectionHeader
              title={<BindingChip status={g.status} />}
              count={g.items.length}
            />
            <div className="space-y-2">
              {g.items.map((c) => (
                <Card key={c.id} id={c.id} className="scroll-mt-4 space-y-2.5 p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <code className="font-mono text-[11px] text-agent">{c.id}</code>
                    <span className="text-[12px] font-medium">{b(c.name)}</span>
                    <BindingChip status={c.binding.status} />
                  </div>

                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {b(c.description)}
                  </p>

                  {c.binding.erpEndpoint && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("capabilities.endpoint")}
                      </span>
                      <code className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
                        {c.binding.erpEndpoint}
                      </code>
                    </div>
                  )}

                  <p className="rounded-md border-l-2 border-l-border bg-muted/30 px-2.5 py-1.5 text-[11px] leading-relaxed">
                    {b(c.binding.note)}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {c.scenarioIds.map((id) => {
                      const s = getScenario(id);
                      return (
                        <Link key={id} href={`/understanding/${id}`}>
                          <Badge variant="outline" className="font-mono hover:bg-accent">
                            {s?.code ?? id}
                          </Badge>
                        </Link>
                      );
                    })}
                    {c.openQuestionIds.map((id) => {
                      const q = getQuestion(id);
                      if (!q) return null;
                      return (
                        <Link key={id} href={`/questions/${id}`}>
                          <Badge variant="info" className="gap-1 font-mono hover:opacity-80">
                            <HelpCircle className="size-2.5" />
                            {q.code}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>

                  <CitationList citations={c.citations} />
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
