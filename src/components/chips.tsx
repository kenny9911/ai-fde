"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleDot,
  FileSearch,
  Gavel,
  HelpCircle,
  Quote,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";

import { Badge, type BadgeVariant } from "./ui";
import { useB, useT } from "@/lib/i18n";
import { categoryLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type {
  AgentSeat,
  Attribution,
  BindingStatus,
  Citation,
  EvidenceGrade,
  FindingVerdict,
  QuestionCategory,
  QuestionSeverity,
  QuestionStatus,
  ScenarioStatus,
} from "@/lib/types";
import { getSource } from "@/data";

// ─────────────────────────────────────────────────────────────────────────
//  Seat badge — who produced this, and in which seat.
//  The whole method rests on model diversity, so attribution is never hidden.
// ─────────────────────────────────────────────────────────────────────────

const seatIcon: Record<AgentSeat, React.ComponentType<{ className?: string }>> = {
  extractor: FileSearch,
  analyst: Bot,
  challenger: Gavel,
  synthesizer: CheckCircle2,
};

const seatTone: Record<AgentSeat, BadgeVariant> = {
  extractor: "info",
  analyst: "agent",
  challenger: "warning",
  synthesizer: "default",
};

export function SeatBadge({
  attribution,
  showModel = true,
  className,
}: {
  attribution: Attribution;
  showModel?: boolean;
  className?: string;
}) {
  const t = useT();
  const Icon = seatIcon[attribution.seat];
  return (
    <Badge variant={seatTone[attribution.seat]} className={cn("gap-1", className)}>
      <Icon className="size-2.5" />
      <span>{t(`seat.${attribution.seat}` as const)}</span>
      {showModel && (
        <span className="font-mono opacity-70">· {attribution.model}</span>
      )}
    </Badge>
  );
}

export function HumanBadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="gap-1">
      <User className="size-2.5" />
      {name}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Evidence grade — the distinction the challenger pass exists to enforce
// ─────────────────────────────────────────────────────────────────────────

const evidenceTone: Record<EvidenceGrade, BadgeVariant> = {
  stated: "success",
  inferred: "warning",
  assumed: "danger",
  contradicted: "danger",
};

export function EvidenceChip({ grade }: { grade: EvidenceGrade }) {
  const t = useT();
  return (
    <Badge variant={evidenceTone[grade]} className="gap-1">
      {grade === "contradicted" && <ShieldAlert className="size-2.5" />}
      {grade === "assumed" && <HelpCircle className="size-2.5" />}
      {t(`evidence.${grade}` as const)}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Status pills
// ─────────────────────────────────────────────────────────────────────────

const questionStatusTone: Record<QuestionStatus, BadgeVariant> = {
  draft: "muted",
  asked: "info",
  answered: "success",
  resolved: "default",
  deferred: "outline",
};

const questionStatusLabel: Record<QuestionStatus, { en: string; zh: string }> = {
  draft: { en: "Draft", zh: "草拟" },
  asked: { en: "Asked", zh: "已提问" },
  answered: { en: "Answered", zh: "已答复" },
  resolved: { en: "Resolved", zh: "已闭环" },
  deferred: { en: "Deferred", zh: "已搁置" },
};

export function QuestionStatusChip({ status }: { status: QuestionStatus }) {
  const b = useB();
  return (
    <Badge variant={questionStatusTone[status]}>
      {b(questionStatusLabel[status])}
    </Badge>
  );
}

const severityTone: Record<QuestionSeverity, BadgeVariant> = {
  blocker: "danger",
  major: "warning",
  minor: "muted",
};

const severityLabel: Record<QuestionSeverity, { en: string; zh: string }> = {
  blocker: { en: "Blocker", zh: "阻断" },
  major: { en: "Major", zh: "重要" },
  minor: { en: "Minor", zh: "一般" },
};

export function SeverityChip({ severity }: { severity: QuestionSeverity }) {
  const b = useB();
  return (
    <Badge variant={severityTone[severity]} className="gap-1">
      {severity === "blocker" && <AlertTriangle className="size-2.5" />}
      {b(severityLabel[severity])}
    </Badge>
  );
}

const verdictTone: Record<FindingVerdict, BadgeVariant> = {
  open: "warning",
  upheld: "danger",
  refuted: "success",
  "needs-clarification": "info",
};

const verdictLabel: Record<FindingVerdict, { en: string; zh: string }> = {
  open: { en: "Open", zh: "未裁定" },
  upheld: { en: "Upheld", zh: "质证成立" },
  refuted: { en: "Refuted", zh: "质证不成立" },
  "needs-clarification": { en: "Needs clarification", zh: "需澄清" },
};

export function VerdictChip({ verdict }: { verdict: FindingVerdict }) {
  const b = useB();
  const Icon =
    verdict === "refuted"
      ? CheckCircle2
      : verdict === "upheld"
        ? XCircle
        : CircleDot;
  return (
    <Badge variant={verdictTone[verdict]} className="gap-1">
      <Icon className="size-2.5" />
      {b(verdictLabel[verdict])}
    </Badge>
  );
}

const scenarioStatusTone: Record<ScenarioStatus, BadgeVariant> = {
  draft: "muted",
  challenged: "warning",
  clarifying: "info",
  agreed: "success",
  baselined: "default",
};

const scenarioStatusLabel: Record<ScenarioStatus, { en: string; zh: string }> = {
  draft: { en: "Draft", zh: "草稿" },
  challenged: { en: "Challenged", zh: "质证中" },
  clarifying: { en: "Clarifying", zh: "澄清中" },
  agreed: { en: "Agreed", zh: "已达成一致" },
  baselined: { en: "Baselined", zh: "已入基线" },
};

export function ScenarioStatusChip({ status }: { status: ScenarioStatus }) {
  const b = useB();
  return (
    <Badge variant={scenarioStatusTone[status]}>
      {b(scenarioStatusLabel[status])}
    </Badge>
  );
}

const bindingTone: Record<BindingStatus, BadgeVariant> = {
  bound: "success",
  partial: "warning",
  gap: "danger",
  "custom-required": "info",
  "manual-today": "muted",
};

const bindingLabel: Record<BindingStatus, { en: string; zh: string }> = {
  bound: { en: "Bound", zh: "已绑定" },
  partial: { en: "Partial", zh: "部分支持" },
  gap: { en: "Gap", zh: "能力缺口" },
  "custom-required": { en: "Custom required", zh: "需定制" },
  "manual-today": { en: "Manual today", zh: "目前人工" },
};

export function BindingChip({ status }: { status: BindingStatus }) {
  const b = useB();
  return <Badge variant={bindingTone[status]}>{b(bindingLabel[status])}</Badge>;
}

export function CategoryChip({ category }: { category: QuestionCategory }) {
  const b = useB();
  return <Badge variant="outline">{b(categoryLabel[category])}</Badge>;
}

const findingTypeLabel = {
  omission: { en: "Omission", zh: "流程遗漏" },
  contradiction: { en: "Contradiction", zh: "矛盾" },
  "unproven-inference": { en: "Unproven inference", zh: "未证推论" },
  "unsupported-citation": { en: "Unsupported citation", zh: "引用不支持" },
  "scope-creep": { en: "Scope creep", zh: "范围蔓延" },
} as const;

export function FindingTypeChip({
  type,
}: {
  type: keyof typeof findingTypeLabel;
}) {
  const b = useB();
  return <Badge variant="outline">{b(findingTypeLabel[type])}</Badge>;
}

// ─────────────────────────────────────────────────────────────────────────
//  Citations — a claim without one of these is an inference, and says so
// ─────────────────────────────────────────────────────────────────────────

export function CitationList({
  citations,
  className,
}: {
  citations: Citation[];
  className?: string;
}) {
  const t = useT();
  const b = useB();

  if (citations.length === 0) {
    return (
      <p className="text-[11px] italic text-muted-foreground">
        {t("common.none")}
      </p>
    );
  }

  return (
    <ul className={cn("space-y-1.5", className)}>
      {citations.map((c, i) => {
        const src = getSource(c.sourceId);
        return (
          <li key={`${c.sourceId}-${c.locator}-${i}`} className="text-[11px]">
            <Link
              href={`/sources/${c.sourceId}`}
              className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
            >
              {c.sourceId}
              <span className="text-muted-foreground">· {c.locator}</span>
            </Link>
            {src && (
              <span className="ml-1.5 text-muted-foreground/80">{b(src.title)}</span>
            )}
            {c.snippet && (
              <blockquote className="mt-1 flex gap-1.5 border-l-2 border-border pl-2 text-muted-foreground">
                <Quote className="mt-0.5 size-2.5 shrink-0 opacity-50" />
                <span className="italic">{c.snippet}</span>
              </blockquote>
            )}
          </li>
        );
      })}
    </ul>
  );
}
