/**
 * AI-FDE domain model.
 *
 * AI-FDE is an AI Ontology Architect / Ontology Consultant / AI Analyst that
 * sits *before* ontology authoring. It turns raw engagement material — decks,
 * screenshots, transcripts, system exports — into a defensible, evidence-backed
 * Business Understanding Baseline that human ERP consultants and FDEs can sign.
 *
 * Three invariants shape every type in this file:
 *
 *  1. EVIDENCE OR IT DIDN'T HAPPEN. Every claim the AI makes carries
 *     `citations` back to a specific page of a specific source. A claim with no
 *     citation is an *inference* and is labelled as one.
 *  2. ATTRIBUTION IS VISIBLE. The pipeline deliberately runs different models
 *     in different seats (extractor / analyst / challenger). Who said what is a
 *     first-class field, never flattened into an anonymous "AI said".
 *  3. GIT IS THE SYSTEM OF RECORD. Every artifact knows its `repoPath`. The UI
 *     is a lens over tracked files, not a database with a git export button.
 */

// ─────────────────────────────────────────────────────────────────────────
//  Primitives
// ─────────────────────────────────────────────────────────────────────────

/** Every user-visible domain string ships in both locales from the start. */
export interface Bilingual {
  en: string;
  zh: string;
}

export type Locale = "en" | "zh";

/** The seat a model occupied when it produced an artifact. */
export type AgentSeat = "extractor" | "analyst" | "challenger" | "synthesizer";

/** Who produced this, in which seat, with which model. */
export interface Attribution {
  seat: AgentSeat;
  /** Display name of the model, e.g. "Claude Opus 5", "Codex". */
  model: string;
  /** ISO date. */
  at: string;
}

/** A pointer from a claim back to the exact source material that supports it. */
export interface Citation {
  sourceId: string;
  /** Page / slide index within the source (1-based). */
  page?: number;
  /** Human-readable locator: "slide 14", "12:40", "§3.2". */
  locator: string;
  /** Verbatim span, quoted so a reviewer can check without opening the file. */
  snippet?: string;
}

/**
 * How a claim came to exist. The distinction is the whole point of the
 * challenger pass: `stated` survives scrutiny, `inferred` must be defended,
 * `assumed` is a placeholder waiting for a consultant.
 */
export type EvidenceGrade = "stated" | "inferred" | "assumed" | "contradicted";

export type Confidence = number; // 0..1

// ─────────────────────────────────────────────────────────────────────────
//  Pipeline
// ─────────────────────────────────────────────────────────────────────────

export type PhaseId =
  | "ingest"
  | "understand"
  | "challenge"
  | "clarify"
  | "baseline";

export interface Phase {
  id: PhaseId;
  name: Bilingual;
  /** One line on what this phase is for. */
  purpose: Bilingual;
  /** Which seat drives this phase. */
  drivenBy: AgentSeat | "human";
  status: "done" | "active" | "pending";
  /** 0..100 — how complete this phase is. */
  progress: number;
}

// ─────────────────────────────────────────────────────────────────────────
//  Sources — the evidence corpus
// ─────────────────────────────────────────────────────────────────────────

export type SourceKind =
  | "deck"
  | "transcript"
  | "screenshot"
  | "document"
  | "system-export"
  | "spreadsheet";

export type ExtractionStatus = "extracted" | "partial" | "failed" | "queued";

export interface SourcePage {
  /** 1-based index within the source. */
  index: number;
  title: Bilingual;
  /** What the extractor pulled off this page. */
  extractedText: string;
  /** Business entities the extractor spotted — feeds the analyst pass. */
  entities: string[];
  /** Has the analyst pass actually consumed this page yet? */
  analyzed: boolean;
  /** Extractor's note when a page is unreadable or ambiguous. */
  note?: Bilingual;
}

export interface Source {
  id: string;
  kind: SourceKind;
  title: Bilingual;
  /** Who handed this over, e.g. "国网某省电力 物资部". */
  provider: Bilingual;
  receivedAt: string;
  /** Tracked path inside the analysis repo. */
  repoPath: string;
  status: ExtractionStatus;
  pages: SourcePage[];
  /** Pages the extractor could not read at all. */
  unreadablePages: number[];
}

// ─────────────────────────────────────────────────────────────────────────
//  Understanding — what the analyst reconstructed
// ─────────────────────────────────────────────────────────────────────────

export type ScenarioStatus =
  | "draft"
  | "challenged"
  | "clarifying"
  | "agreed"
  | "baselined";

/** One reconstructed step in a business workflow. */
export interface ScenarioStep {
  id: string;
  seq: number;
  name: Bilingual;
  /** Role id that performs this step. */
  actorRoleId: string;
  /** What the step consumes and produces, by work-item id. */
  consumes: string[];
  produces: string[];
  /** Abstract capability this step needs from the ERP, if any. */
  capabilityId?: string;
  description: Bilingual;
  evidence: EvidenceGrade;
  citations: Citation[];
  confidence: Confidence;
  /** Decision branches out of this step. */
  branches?: Array<{ condition: Bilingual; toStepId: string | "exit" }>;
}

export interface Scenario {
  id: string;
  code: string; // e.g. "PR-05"
  name: Bilingual;
  summary: Bilingual;
  /** Which slice of the procurement lifecycle this covers. */
  stage: Bilingual;
  status: ScenarioStatus;
  repoPath: string;
  trigger: Bilingual;
  outcome: Bilingual;
  /** Roles that participate, by role id. */
  roleIds: string[];
  /** Work items that flow through, by work-item id. */
  workItemIds: string[];
  steps: ScenarioStep[];
  /** Known variants the consultant must confirm or rule out. */
  variants: Array<{ name: Bilingual; note: Bilingual; confirmed: boolean }>;
  /** Open questions blocking this scenario, by question id. */
  openQuestionIds: string[];
  /** Challenge findings raised against this scenario. */
  findingIds: string[];
  citations: Citation[];
  confidence: Confidence;
  attribution: Attribution;
  /** Coverage of source pages that mention this scenario, 0..100. */
  sourceCoverage: number;
}

export interface Role {
  id: string;
  name: Bilingual;
  /** Organisational home, e.g. "物资部 / Materials Dept". */
  orgUnit: Bilingual;
  responsibilities: Bilingual[];
  /** Corresponding role in the target ERP, if one exists. */
  erpRole?: string;
  /** True when the role exists in the business but has no ERP counterpart. */
  unmappedInErp: boolean;
  scenarioIds: string[];
  citations: Citation[];
}

export type WorkItemType =
  | "document"
  | "approval"
  | "task"
  | "record"
  | "master-data";

export interface WorkItem {
  id: string;
  name: Bilingual;
  type: WorkItemType;
  description: Bilingual;
  /** Role id that owns the item. */
  ownerRoleId: string;
  /** Where this lives in the ERP today, if anywhere. */
  erpObject?: string;
  /** Service-level expectation stated by the business, if any. */
  sla?: Bilingual;
  scenarioIds: string[];
  citations: Citation[];
  evidence: EvidenceGrade;
}

// ─────────────────────────────────────────────────────────────────────────
//  Gaps & clarification questions — the consultant-facing artifact
// ─────────────────────────────────────────────────────────────────────────

export type QuestionStatus =
  | "draft"
  | "asked"
  | "answered"
  | "resolved"
  | "deferred";

export type QuestionSeverity = "blocker" | "major" | "minor";

export type QuestionCategory =
  | "process-gap"
  | "data-definition"
  | "authority"
  | "exception-path"
  | "integration"
  | "compliance"
  | "scope";

export interface Question {
  id: string;
  code: string; // e.g. "Q-014"
  question: Bilingual;
  /** Why this blocks progress — stated in terms of what cannot be modelled. */
  whyItMatters: Bilingual;
  category: QuestionCategory;
  severity: QuestionSeverity;
  status: QuestionStatus;
  repoPath: string;
  /** Scenario / role / work-item ids this question blocks. */
  blocks: string[];
  citations: Citation[];
  /** Options the analyst pre-drafted so the consultant can pick, not compose. */
  options?: Array<{ label: Bilingual; implication: Bilingual }>;
  answer?: {
    text: Bilingual;
    answeredBy: string;
    answeredAt: string;
    sessionId?: string;
    /** What the analyst changed as a result. */
    resultingChanges: Bilingual[];
  };
  /** Questions this one spawned once answered. */
  followUpIds: string[];
  raisedBy: Attribution;
  /** Round of the clarify loop that produced this question (1-based). */
  round: number;
}

// ─────────────────────────────────────────────────────────────────────────
//  Challenger pass — adversarial review, independent of the analyst
// ─────────────────────────────────────────────────────────────────────────

export type FindingType =
  | "omission"
  | "contradiction"
  | "unproven-inference"
  | "unsupported-citation"
  | "scope-creep";

export type FindingVerdict =
  | "open"
  | "upheld"
  | "refuted"
  | "needs-clarification";

export interface ChallengeFinding {
  id: string;
  code: string; // e.g. "C-007"
  type: FindingType;
  severity: QuestionSeverity;
  /** Which artifact is under attack. */
  targetRef: { kind: "scenario" | "step" | "role" | "work-item"; id: string };
  /** The analyst's original claim, quoted. */
  claim: Bilingual;
  /** The challenger's argument against it. */
  challenge: Bilingual;
  citations: Citation[];
  verdict: FindingVerdict;
  /** How the analyst revised after the challenge. */
  revision?: Bilingual;
  /** Question spawned when the challenge could only be settled by a human. */
  spawnedQuestionId?: string;
  raisedBy: Attribution;
  reviewedBy?: Attribution;
  repoPath: string;
  round: number;
}

// ─────────────────────────────────────────────────────────────────────────
//  Clarification sessions — the human consultant loop
// ─────────────────────────────────────────────────────────────────────────

export interface ClarificationSession {
  id: string;
  code: string; // e.g. "S-03"
  title: Bilingual;
  date: string;
  durationMinutes: number;
  /** Human participants, by name and role. */
  participants: Array<{ name: string; role: Bilingual; org: Bilingual }>;
  /** Questions on the agenda, by question id. */
  agendaQuestionIds: string[];
  /** Questions actually answered in the room. */
  answeredQuestionIds: string[];
  /** New questions the session surfaced. */
  spawnedQuestionIds: string[];
  repoPath: string;
  /** Verbatim excerpts worth keeping — the "口水稿" made durable. */
  transcriptExcerpts: Array<{
    speaker: string;
    at: string;
    text: Bilingual;
    /** Question this excerpt answers, if any. */
    answersQuestionId?: string;
  }>;
  /** What changed in the understanding as a result of this session. */
  deltas: Array<{
    kind: "added" | "changed" | "removed" | "confirmed";
    target: Bilingual;
    detail: Bilingual;
  }>;
  status: "scheduled" | "held" | "written-up";
  round: number;
}

// ─────────────────────────────────────────────────────────────────────────
//  ERP capability map — abstraction over the underlying metaERP
// ─────────────────────────────────────────────────────────────────────────

export type BindingStatus =
  | "bound"
  | "partial"
  | "gap"
  | "custom-required"
  | "manual-today";

/**
 * An abstract business capability the ontology will call. Deliberately named
 * in platform-neutral terms so the ontology never hard-codes a metaERP
 * endpoint — the binding below is the only place the vendor leaks in.
 */
export interface Capability {
  id: string; // e.g. "procurement.requisition.create"
  name: Bilingual;
  description: Bilingual;
  /** Scenario ids that need this capability. */
  scenarioIds: string[];
  binding: {
    status: BindingStatus;
    /** metaERP service / endpoint this maps to, when it exists. */
    erpEndpoint?: string;
    /** Why it is a gap, or what the workaround is today. */
    note: Bilingual;
  };
  /** Questions blocking the binding decision. */
  openQuestionIds: string[];
  citations: Citation[];
}

// ─────────────────────────────────────────────────────────────────────────
//  Baseline — the freeze gate
// ─────────────────────────────────────────────────────────────────────────

export interface GateCheck {
  id: string;
  name: Bilingual;
  /** Why this gate exists — what goes wrong downstream if it is skipped. */
  rationale: Bilingual;
  status: "pass" | "warn" | "fail";
  /** Current measured value and the threshold it must clear. */
  actual: string;
  threshold: string;
  /** Ids of whatever is failing, so the UI can link straight to it. */
  offenders: string[];
}

export interface ScopeDecision {
  id: string;
  item: Bilingual;
  decision: "in" | "out" | "deferred";
  rationale: Bilingual;
  decidedBy: string;
  decidedAt: string;
}

export interface Baseline {
  version: string;
  status: "open" | "ready-to-freeze" | "frozen";
  frozenAt?: string;
  signedOffBy: Array<{ name: string; role: Bilingual; at?: string }>;
  gates: GateCheck[];
  scope: ScopeDecision[];
  repoPath: string;
}

// ─────────────────────────────────────────────────────────────────────────
//  Activity — the git-backed audit trail
// ─────────────────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  at: string;
  /** Human name, or model name when a seat produced the change. */
  actor: string;
  seat?: AgentSeat;
  phase: PhaseId;
  message: Bilingual;
  /** Files touched, relative to the analysis repo root. */
  files: string[];
  /** Short commit-ish hash, for the "git is the record" affordance. */
  ref: string;
}

// ─────────────────────────────────────────────────────────────────────────
//  Engagement — the top-level container
// ─────────────────────────────────────────────────────────────────────────

export interface Engagement {
  id: string;
  client: Bilingual;
  /** Short internal codename shown in the header. */
  codename: string;
  domain: Bilingual;
  targetSystem: Bilingual;
  /** The analysis repo this UI is a lens over. */
  repo: string;
  startedAt: string;
  /** Which round of the clarify loop we are on. */
  currentRound: number;
  phases: Phase[];
  leadConsultant: string;
  leadFde: string;
}
