import type {
  ChallengeFinding,
  Question,
  Scenario,
  Source,
} from "@/lib/types";

import { activity, engagement } from "./engagement";
import { sources } from "./sources";
import { roles, workItems } from "./actors";
import { scenarios } from "./scenarios";
import { questions } from "./questions";
import { findings } from "./challenges";
import { sessions } from "./sessions";
import { baseline, capabilities } from "./capabilities";

export {
  activity,
  baseline,
  capabilities,
  engagement,
  findings,
  questions,
  roles,
  scenarios,
  sessions,
  sources,
  workItems,
};

// ─────────────────────────────────────────────────────────────────────────
//  Lookups
// ─────────────────────────────────────────────────────────────────────────

export const getScenario = (id: string) => scenarios.find((s) => s.id === id);
export const getQuestion = (id: string) => questions.find((q) => q.id === id);
export const getSource = (id: string) => sources.find((s) => s.id === id);
export const getRole = (id: string) => roles.find((r) => r.id === id);
export const getWorkItem = (id: string) => workItems.find((w) => w.id === id);
export const getSession = (id: string) => sessions.find((s) => s.id === id);
export const getFinding = (id: string) => findings.find((f) => f.id === id);
export const getCapability = (id: string) =>
  capabilities.find((c) => c.id === id);

/** Resolve any artifact id to a display label — used by cross-links. */
export function labelForRef(id: string): string {
  return (
    getScenario(id)?.code ??
    getQuestion(id)?.code ??
    getWorkItem(id)?.id ??
    getRole(id)?.id ??
    getCapability(id)?.id ??
    id
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Derived metrics — the numbers the dashboard and the freeze gate agree on.
//  Computed in one place so a gate can never disagree with the tile above it.
// ─────────────────────────────────────────────────────────────────────────

export interface EngagementMetrics {
  openQuestions: number;
  blockerQuestions: number;
  answeredQuestions: number;
  resolvedQuestions: number;
  openFindings: number;
  upheldFindings: number;
  refutedFindings: number;
  scenariosTotal: number;
  scenariosAgreed: number;
  /** Mean source coverage across scenarios, 0..100. */
  meanCoverage: number;
  /** Source pages extracted but never consumed by the analyst. */
  unanalysedPages: number;
  unreadablePages: number;
  capabilityGaps: number;
  /** 0..100 — how close the engagement is to a defensible freeze. */
  baselineReadiness: number;
}

export function computeMetrics(): EngagementMetrics {
  const openQuestions = questions.filter(
    (q) => q.status === "draft" || q.status === "asked",
  ).length;
  const blockerQuestions = questions.filter(
    (q) => q.severity === "blocker" && (q.status === "draft" || q.status === "asked"),
  ).length;
  const answeredQuestions = questions.filter((q) => q.status === "answered").length;
  const resolvedQuestions = questions.filter((q) => q.status === "resolved").length;

  const openFindings = findings.filter(
    (f) => f.verdict === "open" || f.verdict === "needs-clarification",
  ).length;
  const upheldFindings = findings.filter((f) => f.verdict === "upheld").length;
  const refutedFindings = findings.filter((f) => f.verdict === "refuted").length;

  const scenariosAgreed = scenarios.filter(
    (s) => s.status === "agreed" || s.status === "baselined",
  ).length;

  const meanCoverage = Math.round(
    scenarios.reduce((sum, s) => sum + s.sourceCoverage, 0) / scenarios.length,
  );

  // An unreadable page is also flagged un-analysed, so the two sets overlap.
  // Count the union, or the "source gaps" tile reports more holes than exist.
  const unreadableKeys = new Set(
    sources.flatMap((s) => s.unreadablePages.map((p) => `${s.id}:${p}`)),
  );
  const unreadablePages = unreadableKeys.size;
  const unanalysedPages = sources
    .flatMap((s) => s.pages.map((p) => ({ key: `${s.id}:${p.index}`, p })))
    .filter((x) => !x.p.analyzed && !unreadableKeys.has(x.key)).length;

  const capabilityGaps = capabilities.filter(
    (c) => c.binding.status === "gap" || c.binding.status === "manual-today",
  ).length;

  // Readiness is the share of freeze gates currently passing, with a warn
  // counting as half. Deliberately harsh: it is a gate, not a mood ring.
  const gateScore = baseline.gates.reduce(
    (sum, g) => sum + (g.status === "pass" ? 1 : g.status === "warn" ? 0.5 : 0),
    0,
  );
  const baselineReadiness = Math.round(
    (gateScore / baseline.gates.length) * 100,
  );

  return {
    openQuestions,
    blockerQuestions,
    answeredQuestions,
    resolvedQuestions,
    openFindings,
    upheldFindings,
    refutedFindings,
    scenariosTotal: scenarios.length,
    scenariosAgreed,
    meanCoverage,
    unanalysedPages,
    unreadablePages,
    capabilityGaps,
    baselineReadiness,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  Relationship helpers
// ─────────────────────────────────────────────────────────────────────────

export function questionsForScenario(scenarioId: string): Question[] {
  return questions.filter((q) => q.blocks.includes(scenarioId));
}

/**
 * Findings reachable from a scenario. A challenge can target the scenario, one
 * of its steps, or a role / work item that participates in it — the last case
 * matters because a scope-creep finding against a work item (C-009 vs. W-22) is
 * otherwise invisible from every page a reviewer would actually open.
 */
export function findingsForScenario(scenarioId: string): ChallengeFinding[] {
  const scenario = getScenario(scenarioId);
  const stepIds = new Set(scenario?.steps.map((s) => s.id) ?? []);
  return findings.filter((f) => {
    const { kind, id } = f.targetRef;
    if (id === scenarioId || stepIds.has(id)) return true;
    if (kind === "role") return !!getRole(id)?.scenarioIds.includes(scenarioId);
    if (kind === "work-item")
      return !!getWorkItem(id)?.scenarioIds.includes(scenarioId);
    return false;
  });
}

/** Questions still awaiting an answer for this scenario. */
export function openQuestionsForScenario(scenarioId: string): Question[] {
  return questionsForScenario(scenarioId).filter(
    (q) => q.status === "draft" || q.status === "asked",
  );
}

export function scenariosCiting(sourceId: string): Scenario[] {
  return scenarios.filter((s) =>
    s.citations.some((c) => c.sourceId === sourceId),
  );
}

/** Pages of a source that no scenario or question has cited yet. */
export function uncitedPages(source: Source): number[] {
  const cited = new Set<number>();
  const collect = (arr: { citations: { sourceId: string; page?: number }[] }[]) => {
    for (const item of arr) {
      for (const c of item.citations) {
        if (c.sourceId === source.id && c.page != null) cited.add(c.page);
      }
    }
  };
  collect(scenarios);
  collect(questions);
  collect(findings);
  return source.pages.map((p) => p.index).filter((i) => !cited.has(i));
}
