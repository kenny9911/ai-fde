# AI-FDE — Product Design & Specification

**Status:** v0.2 draft · working spec for further development
**Origin:** [`docs/origin-prompt.md`](origin-prompt.md)
**Built today:** v0.1 — eight surfaces, seeded engagement, no live models
**Written against the goal:** *"So what do we need to help them to do the AI projects
and agentic ERP project implementation and delivery?"*

---

## 0. One-paragraph thesis

An ERP engagement fails in the first three weeks, silently. Someone reconstructs the
business wrong, nobody notices, and the error is discovered during UAT at 40× the
cost. Senior consultants avoid this with a method they cannot articulate and do not
have time to teach. **AI-FDE encodes that method as a rail**: it runs the multi-model
analysis the user cannot orchestrate, forces evidence discipline so a novice cannot
ship confident nonsense, supplies the domain knowledge a young FDE does not have, and
refuses to let the team freeze a baseline it cannot defend. The deliverable is a
signed Business Understanding Baseline — and, from v2, the ontology, agent specs and
eval suite that turn that baseline into an agentic ERP implementation.

**AI-FDE is not a chatbot, and not a document generator. It is a method harness with
AI inside.**

---

## 1. The user

### 1.1 Three personas, three deficits

| | **P1 · 新手 ERP 顾问**<br>Inexperienced ERP consultant | **P2 · 不会用 AI 的顾问**<br>Domain-strong, AI-naive consultant | **P3 · 年轻 FDE**<br>Young forward-deployed engineer |
|---|---|---|---|
| **Has** | Module knowledge (PO, GR, IV). Client-facing confidence. | Deep domain judgement. Client trust. 20 years of edge cases. | Engineering skill. Comfort with Codex / Claude Code / git. Speed. |
| **Lacks** | Method. Doesn't know what "complete" looks like or which questions matter. | Any way to make AI useful beyond a chat box. Cannot verify AI output, so distrusts all of it. | Business-system understanding. Cannot distinguish a plausible workflow from a correct one. |
| **Fails by** | Analysing what's easy, missing exception paths, discovering blockers in UAT. | Doing it all by hand at 1× speed, or pasting a deck into a chat and shipping the summary. | Producing a beautiful, internally consistent, wrong model — fast. |
| **Needs from AI-FDE** | A rail with gates. "What do I do next, and am I done?" | Orchestration behind a button, and a reason to trust the output. | Domain grounding in the flow of work, and a hard stop before a human has confirmed. |

### 1.2 The shared job-to-be-done

> *"Turn a pile of client decks, screenshots, regulations and meeting recordings into a
> business understanding my client will sign and my build team can implement — without
> a senior partner sitting next to me."*

### 1.3 Design consequences — the four novice rules

These are the rules that separate this spec from a generic "AI analysis tool." They
exist because of P1/P2/P3, and every surface is checked against them.

**N1 · No blank page, ever.**
No surface presents an empty prompt box or free-text field as the *primary* action.
Every human input is **pick-a-drafted-option, then correct it**. A novice cannot write
a good clarification question from nothing; they can absolutely tell you which of four
drafted options is right, and fix the wording. `Question.options[]` already encodes
this — extend the pattern to scenarios, scope decisions and gate waivers.

**N2 · Teach in the flow, never in a manual.**
Every surface carries a *Method note*: what this phase is for, what good output looks
like, and the three mistakes people make here. Every domain term is a hoverable card
(三单匹配, WBS, 单一来源, 框架协议, 集中采购目录) with definition → why it matters →
what usually goes wrong. Nobody reads documentation during a live engagement; they do
read the panel that is already on screen.

**N3 · The AI proposes, the human disposes — and the record shows which.**
Human confirmation is a first-class, gated field, not a vibe. A scenario that no named
human has reviewed cannot reach `agreed`, no matter how confident the model is. This
is the single most important guardrail for P3.

**N4 · Make the models disagree in public.**
P2 distrusts AI because AI is uniformly confident. The cure is not better prose; it is
visible adversarial process. The challenger is a *different model in a different seat*
that has not seen the analyst's reasoning, and the board shows how often it was
**refuted**. A challenger that is never wrong was shown the answers; a challenger
that is always wrong is noise. Both are displayed, and one is a health metric.

---

## 2. The method the product encodes

### 2.1 The loop

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                                                                  │
   ▼                                                                  │
① INGEST & INDEX ──▶ ② RECONSTRUCT ──▶ ③ CHALLENGE ──▶ ④ CLARIFY ─────┘
   extractor           analyst           challenger      human + analyst
   (Codex)             (Opus 5)          (Codex, blind)  (consultant)
                                                              │
                                            round += 1        │  no open blockers
                                                              ▼
                                                        ⑤ FREEZE BASELINE
                                                          synthesizer
                                                              │
                                                              ▼
                                                        ⑥ HANDOFF → build
```

`/capabilities` cuts across ①–⑤: the ontology → abstraction API → metaERP binding map.

### 2.2 Seats

A **seat** is a role in the pipeline with a fixed remit, a designated model, and a
versioned prompt. Seats are visible in the UI and stamped on every artifact
(`Attribution { seat, model, at }`). Model diversity across seats is a *method
requirement*, not a cost optimisation.

| Seat | Model (default) | Remit | Must NOT |
|---|---|---|---|
| **extractor** | Codex | PPT/PDF/image extraction, page rendering, file structure, source index, completeness check, cross-validation | Interpret business meaning |
| **analyst** | Claude Opus 5 | Per-page understanding, scenario identification, workflow reconstruction, role & work-item identification, gap finding, question drafting | Cite a page it has not read |
| **challenger** | Codex (different context) | Independent hunt for omissions, contradictions, unproven inferences, unsupported citations, scope creep | See the analyst's reasoning traces |
| **synthesizer** | Claude Opus 5 | Revision after challenge, session write-up, gate evaluation, baseline assembly, handoff pack | Resolve a blocker without a human answer |
| **human · consultant** | — | Answers, corrections, scope decisions, sign-off | Be bypassed by any automation |

**The blindness rule (N4, enforced technically).** The challenger run receives: the
source corpus, and the analyst's *conclusions*. It never receives the analyst's chain
of reasoning, its confidence scores, or its own prior findings from this round. It is
prompted to assume the analyst is wrong and to prove it. This is a property of the run
manifest, and a run that violates it is invalid.

### 2.3 Rounds

Every question, finding and session carries `round`. A round is one full
② → ③ → ④ cycle. Rounds end when the round produces no new blocker questions, or when
the consultant declares the remaining questions deferrable. Round count is an
engagement health signal: round 1 with zero blockers means the analysis was shallow,
not that the client was clear.

### 2.4 The three invariants (from v0.1 — unchanged, load-bearing)

1. **Evidence or it didn't happen.** Every claim carries `citations` to a specific page
   of a specific source. `stated` / `inferred` / `assumed` / `contradicted` is a
   first-class field, not a comment.
2. **Attribution is visible.** Who said what is never flattened into "the AI said."
3. **Git is the system of record.** Every artifact has a `repoPath`. The UI is a lens
   over tracked files, not a database with a git export button.

---

## 3. What exists today (v0.1) — an honest inventory

Next.js 16 · React 19 · Tailwind v4 · TypeScript 6. Runs on `pnpm dev` at :4100. No
network calls, no database, no model calls — the engagement is compiled in from
`src/data/*`.

| Route | Purpose | State |
|---|---|---|
| `/` | Engagement overview: the loop, attention queue, commit feed | Built, read-only |
| `/sources` `/sources/[id]` | Evidence corpus, page-level extraction, completeness | Built, read-only |
| `/understanding` `/understanding/[id]` | Scenarios, workflows, roles, work items | Built, read-only |
| `/challenge` | Claim / rebuttal / revision triptych | Built, read-only |
| `/questions` `/questions/[id]` | Clarification board, by consequence | Built, read-only |
| `/sessions` `/sessions/[id]` | Consultant sessions, verbatim excerpts, deltas | Built, read-only |
| `/capabilities` | Ontology → abstraction API → metaERP bindings | Built, read-only |
| `/baseline` | Freeze gates, scope decisions, sign-off | Built, read-only |

Domain model: `src/lib/types.ts` (17 interfaces, complete for phases ①–⑤).
Derived metrics: `computeMetrics()` in `src/data/index.ts` — readiness is *computed
from the gates*, so a tile can never disagree with the gate below it.
Seed: a provincial SOE power-grid procurement engagement on Huawei metaERP — 12
scenarios, 14 roles, 13 work items, 6 sources, 15 questions, 10 findings, 4 sessions,
19 capability bindings. **Deliberately imperfect**: an unreadable slide 42, un-analysed
pages, a blueprint/transcript contradiction, and one refuted challenge.
Bilingual by construction: every domain string is `Bilingual { en, zh }`.

**The gap.** v0.1 is a faithful, well-typed *demonstration of the method*. It does not
yet (a) read a real repository, (b) run any model, (c) accept any human input, (d)
teach anything, or (e) go past the baseline into implementation. Sections 4–8 specify
those five.

---

## 4. What we must build — the goal, decomposed

The goal question: *what do we need to help them do AI projects and agentic ERP
implementation and delivery?* Six capabilities, in dependency order.

| # | Capability | Answers which deficit | Milestone |
|---|---|---|---|
| **C1** | **Real repo, not seed data** — the UI reads and writes an actual git analysis repo | All three: the record must be real to be trusted | M1 |
| **C2** | **Run console** — pre-built multi-model runs behind a button, with visible diffs | P2 (cannot orchestrate), P1 (doesn't know what to run) | M2 |
| **C3** | **Human-in-the-loop write-back** — answers, corrections, confirmations, sign-off, all committed | P3 (must not be able to freeze unreviewed work) | M2 |
| **C4** | **Domain packs + teaching layer** — reference process models, term cards, method notes, exemplars | P3 (no business grounding), P1 (no method) | M3 |
| **C5** | **Interview mode + handoff pack** — run the clarification meeting; ship the result to the team | P1 (can't run a good session), all (最终结果给到工作群) | M4 |
| **C6** | **Ontology, agent specs & evals** — baseline → implementable agentic ERP | The second half of the goal | M5–M6 |

---

## 5. Surface specification

Format per surface: **purpose · primary persona · what changes from v0.1 · acceptance
criteria**. Existing surfaces are extended, not replaced.

### 5.1 `/brief` — Engagement setup (NEW, M1)

**Purpose.** Create the analysis repo and the engagement in under ten minutes, with no
blank fields.
**Primary persona.** P1, P3 — the two who don't know how to start.

A wizard, not a form. Six steps, each pre-filled from the selected domain pack:
client & codename → domain (picks the pack) → target system & abstraction posture →
sources drop zone → team & seats (which model in which seat, with the diversity rule
enforced) → data-residency mode (see §9.2).

Output: an initialised repo at the layout in §6, an `engagement.yaml`, and a first
extractor run queued.

**Acceptance.** A user who has never seen the product reaches a queued extraction run
without typing a free-text sentence, and the repo is a valid git repo with one commit.

### 5.2 `/` — Engagement overview (EXTEND)

**Purpose.** "What do I do next?" answered in one screen.
**Primary persona.** P1.

Changes: the attention queue becomes **the single next action**, ranked by
consequence — one primary card ("3 blocker questions are unanswered; the next session
is Thursday; open the interview agenda"), with the rest collapsed. Add a round banner
(round N, what closes it). Add a *readiness trajectory* sparkline across rounds so a
novice can see whether the engagement is converging or thrashing.

**Acceptance.** From a cold open, a novice can name the correct next action within 15
seconds without clicking anything.

### 5.3 `/sources` (EXTEND)

Add: drag-and-drop ingest with a live extractor run; per-page **render preview** beside
extracted text (slide 42 is unreadable — the user must be able to *see* that, not just
read a note); a *re-extract with a different model* action for failed pages; a
completeness report that names uncited pages as candidate omissions and can promote any
of them to a question in one click.

**Acceptance.** Every unreadable and every un-analysed page has exactly one obvious
remedy on screen.

### 5.4 `/understanding` (EXTEND — this is where P3 is protected)

Add:
- **Human review state** on every scenario and step (§7, `HumanReview`). A scenario
  cannot leave `challenged` without a named reviewer. The UI shows *unreviewed* as a
  loud state, not a quiet one.
- **Pack diff panel** — reconstructed reality vs. the domain pack's reference process:
  *"the reference model has a 采购方式确定 (procurement-method determination) control
  point; your sources never mention one. Omission, or genuinely absent?"* One click
  turns the diff into a question. This is the mechanism that gives a young FDE the
  business grounding they lack.
- **Workflow diagram** for the reconstructed steps, with evidence grade encoded in the
  edge style — an `assumed` transition must look different from a `stated` one at a
  glance.
- Term cards on every domain noun (N2).

**Acceptance.** A reviewer with no procurement background can, on one scenario page,
answer: what happens, who does it, what evidence supports each step, what the reference
model says is missing, and who confirmed it.

### 5.5 `/challenge` (EXTEND)

Add: the **challenger health strip** — findings raised / upheld / refuted this round,
with the refuted rate against its target band (§10). Add per-finding *verdict actions*
for the human (uphold / refute / escalate to question), which is a write action (C3).
Show the blindness manifest for the run: exactly what the challenger was and was not
given.

**Acceptance.** P2 can inspect *why* they should believe a finding, including what the
challenger could not see.

### 5.6 `/questions` (EXTEND)

Add: **owner and due date** per question; severity re-ranking by the human; bulk
"add to Thursday's agenda"; and a `whyItMatters` that stays phrased as *what cannot be
modelled until this is answered*. Keep pre-drafted costed options (N1) and extend them
— every blocker question ships with ≥2 options and their implications, or the analyst
run is incomplete.

**Acceptance.** A consultant can build a 60-minute agenda, ordered by consequence, in
under two minutes.

### 5.7 `/sessions` + **Interview Mode** (EXTEND + NEW, M4)

**Purpose.** Run the clarification meeting, and make 口水稿 durable without homework.
**Primary persona.** P1 (who has never run one), with P2 in the room.

Interview Mode is a distinct, presentation-grade view: one question at a time, large
type, the drafted options visible, a capture field (typed or transcribed), and a live
**"what this changes"** preview showing the scenarios/steps that will be revised by
each option. Works on a laptop at a client site with no network — queue commits, push
later.

After the session, a synthesizer run produces the write-up, the deltas, and the
follow-up questions. The verbatim excerpt is never overwritten by the summary; both
are kept, and the summary cites the excerpt.

**Acceptance.** A one-hour session ends with the repo already containing the verbatim
record, the resulting revisions, and the next round's questions — with no post-meeting
transcription work.

### 5.8 `/capabilities` (EXTEND)

Add: **binding decision workflow** — a `gap` or `manual-today` binding must resolve to
one of {abstraction-layer adapter, metaERP customisation, process change, out of scope},
each with a costed implication (N1). Add the generated **abstraction API contract**
view: the platform-neutral interface the ontology calls, and the metaERP binding behind
it, exportable as an OpenAPI-ish artifact for the build team.

**Acceptance.** Every capability is either bound, or has a named decision with an owner
and a cost.

### 5.9 `/baseline` (EXTEND)

Add gates that specifically catch novice failure modes:

| Gate | Threshold | Catches |
|---|---|---|
| Human review coverage | 100% of `agreed` scenarios have a named reviewer | P3 freezing unreviewed AI output |
| Blocker questions closed | 0 open blockers | P1 declaring victory early |
| Exception-path coverage | every scenario has ≥1 confirmed or explicitly ruled-out exception variant | The classic novice omission: only the happy path |
| Source coverage | ≥ threshold, and no scenario below the floor | Analysis of only the easy sources |
| Challenger refuted rate | inside band (§10) | A rubber-stamp challenger |
| Citation integrity | 0 citations pointing at unreadable or missing pages | Hallucinated evidence |
| Capability decisions | 0 undecided gaps | Deferring the architecture question |

Every failing gate names its offenders and links to them. Add **waiver with rationale**
— a gate may be waived only by a named human with a written reason, and the waiver is
shown on the frozen baseline forever.

**Acceptance.** The freeze button is disabled until every gate passes or carries a
signed waiver, and the frozen artifact is immutable and tagged in git.

### 5.10 `/runs` — Run console (NEW, M2) — **the answer to P2**

**Purpose.** Give the AI orchestration to people who cannot orchestrate.
**Primary persona.** P2, P1.

A catalogue of named runs, each a versioned prompt + seat + input manifest:

| Run | Seat | Input | Output |
|---|---|---|---|
| `extract-source` | extractor | one source | pages, entities, completeness note |
| `reconstruct` | analyst | source pages (+ pack) | scenarios, roles, work items, questions |
| `challenge` | challenger | sources + analyst conclusions **only** | findings |
| `revise` | synthesizer | findings + analyst output | revisions, verdicts |
| `session-writeup` | synthesizer | transcript + agenda | deltas, answers, follow-ups |
| `gate-check` | synthesizer | whole repo | gate evaluation |
| `pack-diff` | analyst | understanding + pack | omission candidates |

Each run shows: what it will read, which model, an estimated cost/time, and — after —
a **diff of what changed in the repo**, accept/reject per hunk, then one commit with a
seat-attributed message. Prompts live in `prompts/` in the repo, versioned; power users
edit them, novices never see them.

**Acceptance.** A user who has never written a prompt can execute the full ①–④ loop.
A user who wants to change how the analyst thinks can do so by editing a tracked file,
and the change is attributable in git.

### 5.11 `/learn` — Domain packs & glossary (NEW, M3) — **the answer to P3**

**Purpose.** Supply the business-system understanding a young FDE does not have, and
the completeness baseline a novice consultant does not have.

A **domain pack** is a versioned, reusable bundle for a domain — the first is
`pack/procurement-soe-power-grid`:

- **Reference process model** — canonical stages (需求申报 → 采购计划 → 采购方式确定 →
  供应商准入 → 招标与开评定标 → 竞争性谈判/单一来源 → 合同签订 → 订单下达 → 收货验收 →
  三单匹配 → 付款结算 → 变更退货索赔), the standard roles and work items at each, and
  the control points that must exist.
- **Must-answer checklist** — the questions every engagement in this domain must
  answer, regardless of what the client's deck happens to mention.
- **Known traps** — e.g. tendering conducted outside the ERP with manual re-entry;
  requisition by material code vs. by WBS for capital construction; globally-unique
  supplier master vs. per-category qualification.
- **Glossary** — bilingual term cards powering N2 across every surface.
- **Regulatory anchors** — 招投标法 thresholds, 集中采购目录 scope, internal control
  requirements — cited, not paraphrased from memory.

Packs are consumed by the `pack-diff` run (§5.4) and rendered as browsable reference.
They are the product's compounding asset: every engagement improves the pack, and the
next novice starts from a better floor.

**Acceptance.** A young FDE can, before their first client meeting, read the reference
process for the domain and understand what the client's deck is *missing*.

### 5.12 `/handoff` — Delivery pack (NEW, M4)

*"最终结果给到参与团队工作群做分享，所有文档以在 git 为主。"*

One frozen baseline → three exports, all generated from the same tracked files:
1. **Client-facing deck** (bilingual) — scope, scenarios, decisions, open items.
2. **Build-team package** — ontology seed, capability/abstraction contract, workflow
   specs, the open-issues register.
3. **Shareable digest** — a single page suitable for a work group chat, with links back
   to git.

**Acceptance.** No one hand-builds a slide from the baseline. Regenerating after a
change takes one command.

---

## 6. The analysis repo contract

Git is the system of record (Invariant 3), so the repo layout *is* an interface. The UI
reads it; the runs write it; a human with a text editor can fix anything.

```
<engagement>/
  engagement.yaml                 # client, codename, domain, target system, seats, round
  00-inbox/                       # raw handover material, immutable, hash-named
  01-sources/
    <source-id>/
      source.yaml                 # kind, provider, receivedAt, status, unreadablePages
      pages/p-014.md              # extracted text + entities, one file per page
      render/p-014.png            # page render, for the preview beside the text
  02-understanding/
    scenarios/PR-05.yaml          # steps, citations, evidence grade, confidence, review
    roles/*.yaml
    work-items/*.yaml
  03-challenge/
    findings/C-007.yaml           # claim, challenge, verdict, revision, blindness manifest
  04-clarify/
    questions/Q-014.yaml          # whyItMatters, options, answer, owner, round
    sessions/S-03/
      session.yaml
      transcript.md               # verbatim — never overwritten by the summary
  05-baseline/
    baseline.yaml  gates.yaml  scope.yaml  waivers.yaml
  06-capabilities/*.yaml          # abstract capability + metaERP binding + decision
  07-ontology/                    # M5: objects, links, rules, actions, events
  08-agents/                      # M6: agent specs, guardrails, evals
  packs/                          # domain packs, vendored or submodule, version-pinned
  prompts/<seat>/<run>.md         # versioned seat prompts
  runs/<run-id>/                  # manifest (inputs, model, blindness), raw output, diff
```

**Rules.**
- YAML for structured artifacts, Markdown for prose. Both human-diffable — a
  consultant must be able to correct a claim in a text editor and commit it.
- One artifact per file. Never a monolith; git conflicts must be readable.
- IDs are stable and human-legible (`PR-05`, `Q-014`, `C-007`, `S-03`).
- Every commit is attributed to a seat or a person, and names the round.
- `runs/` is the audit trail of what the AI was actually asked and actually returned.
  A finding whose run manifest is missing is not admissible.
- The frozen baseline is a git tag, and the tagged tree is never rewritten.

---

## 7. Domain model extensions

`src/lib/types.ts` is complete for phases ①–⑤ as a read model. These additions make it
a write model and add the novice guardrails. Shown as deltas.

```ts
// ── N3: human confirmation as a first-class, gated field ──────────────────
export interface HumanReview {
  by: string;                 // named person — never "the team"
  at: string;                 // ISO
  verdict: "confirmed" | "corrected" | "rejected";
  note?: Bilingual;
  /** Session this confirmation happened in, when it happened in one. */
  sessionId?: string;
}

// Scenario, ScenarioStep, WorkItem, Role gain:
//   review?: HumanReview;
// A scenario may not reach status "agreed" without review.verdict !== "rejected".

// ── Questions gain ownership, so a board can be worked ────────────────────
// Question gains:
//   owner?: string;
//   dueAt?: string;
//   askedInSessionIds: string[];

// ── C2: runs are artifacts, and the blindness rule is auditable ───────────
export interface RunManifest {
  id: string;
  run: "extract-source" | "reconstruct" | "challenge" | "revise"
     | "session-writeup" | "gate-check" | "pack-diff";
  seat: AgentSeat;
  model: string;
  promptPath: string;          // versioned file in prompts/
  promptSha: string;
  /** Exactly which repo paths were placed in context. */
  inputs: string[];
  /** Paths deliberately withheld — the challenger's blindness, made auditable. */
  withheld: string[];
  startedAt: string;
  finishedAt?: string;
  status: "queued" | "running" | "succeeded" | "failed" | "rejected";
  /** Repo paths created/changed/deleted, before human accept/reject. */
  diff: Array<{ path: string; change: "add" | "modify" | "delete" }>;
  /** Commit ref once accepted. */
  ref?: string;
  round: number;
  costEstimate?: { inputTokens: number; outputTokens: number };
}

// ── C4: domain packs ──────────────────────────────────────────────────────
export interface GlossaryTerm {
  id: string;
  term: Bilingual;
  definition: Bilingual;
  whyItMatters: Bilingual;     // N2 — never a bare definition
  commonMistake: Bilingual;
  relatedIds: string[];
}

export interface ReferenceStage {
  id: string;
  name: Bilingual;
  purpose: Bilingual;
  typicalRoles: Bilingual[];
  typicalWorkItems: Bilingual[];
  /** Controls that must exist, or be explicitly ruled out. */
  controlPoints: Array<{ name: Bilingual; why: Bilingual }>;
  /** Exception paths novices forget. */
  commonExceptions: Bilingual[];
}

export interface DomainPack {
  id: string;                  // "procurement-soe-power-grid"
  version: string;
  name: Bilingual;
  stages: ReferenceStage[];
  mustAnswer: Array<{ question: Bilingual; whyItMatters: Bilingual;
                      category: QuestionCategory }>;
  traps: Array<{ name: Bilingual; symptom: Bilingual; implication: Bilingual }>;
  glossary: GlossaryTerm[];
  regulatoryAnchors: Array<{ name: Bilingual; citation: string;
                             appliesWhen: Bilingual }>;
}

/** Output of the pack-diff run — the mechanism that grounds P3. */
export interface PackGap {
  id: string;
  packStageId: string;
  kind: "missing-stage" | "missing-control" | "missing-role"
      | "missing-exception" | "unanswered-must-answer";
  detail: Bilingual;
  /** Scenario this would attach to, if any. */
  scenarioId?: string;
  status: "candidate" | "promoted-to-question" | "ruled-out";
  ruledOutRationale?: Bilingual;
}

// ── Gate waivers: escape hatches that leave a permanent mark ──────────────
export interface GateWaiver {
  gateId: string;
  by: string;
  at: string;
  rationale: Bilingual;
  /** Shown on the frozen baseline forever. */
  acceptedRisk: Bilingual;
}
```

**Metric additions** to `computeMetrics()`: `unreviewedScenarios`, `packGapsOpen`,
`challengerRefutedRate`, `citationIntegrityErrors`, `undecidedCapabilities`. Keep the
existing discipline — readiness is *derived from the gates*, never asserted.

---

## 8. Beyond the baseline — agentic ERP implementation (M5–M6)

The second half of the goal. The baseline is the input, not the finish line.

### 8.1 `/ontology` (M5)

Baseline → ontology, with the same evidence discipline. Objects, properties, links,
rules, actions, events — every element tracing to the scenario step and citation that
justified it. An ontology element with no upstream baseline reference is flagged: it
was invented, not derived.

The abstraction posture from Brief 1 holds: the ontology names capabilities in
platform-neutral terms; `/capabilities` is the only place Huawei metaERP appears.

### 8.2 `/agents` (M6)

For each scenario step, an explicit automation decision: **agent-run**,
**agent-proposes / human-approves**, or **human-only** — with the rationale and the
control that justifies it (an SOE approval chain is not automatable because someone
enjoys clicking; it is a control).

Each agent spec carries: purpose, the capabilities it may call (tools = the abstraction
API, nothing else), guardrails derived from the ontology rules, escalation paths, and
the audit obligations the client's internal control regime requires.

### 8.3 Evals (M6)

Scenarios become test cases. Each confirmed step is an assertion: *given this state,
does the agent do the right thing at step 7?* Exception variants become adversarial
cases. The eval suite is generated from the baseline and lives in the repo, so an agent
change is testable against the business understanding a client actually signed.

This closes the loop: the reason to insist on evidence, human review and exception
coverage in phase ② is that in phase ⑧ those become the tests.

---

## 9. Non-functional requirements

### 9.1 Bilingual by construction
Every domain string is `Bilingual { en, zh }` in the data. The locale switch is a field
selector, not a translation lookup. The client reviews in Chinese; the delivery team
builds in English; nothing is translated twice. Packs, prompts and exports follow the
same rule.

### 9.2 Data residency — non-negotiable for the target client
A provincial SOE power-grid operator's procurement data does not leave the client
network. The product must support:
- **Model routing per seat**, including on-prem / private-endpoint models, configured at
  `/brief` and recorded in `engagement.yaml`.
- **Air-gapped operation** — the app runs locally against a local repo with no outbound
  calls except to the configured model endpoints. v0.1 already has zero external
  dependencies (no network fonts, no CDN, no telemetry); keep it that way.
- **A residency mode banner** so a user cannot accidentally send a client deck to a
  public endpoint. Sending is blocked, not warned, in restricted mode.

Model diversity across seats (§2.2) must be satisfiable *within* the residency
constraint — if only one model family is available on-prem, the product must say so
plainly and degrade the challenger to a different-context/different-prompt run, marked
as weaker in the health strip rather than silently equivalent.

### 9.3 Offline and site-resilient
Client sites have bad networks. Interview Mode, the questions board and the sources
reader must work offline against the local repo, queueing commits.

### 9.4 Performance & scale
An engagement is thousands of pages, not millions. Target: repo load < 2s for 5,000
pages; any surface interactive < 200ms after load. Runs are async and resumable — a
dropped connection must never lose a run's output (it's on disk in `runs/`).

### 9.5 Accessibility & presentation
Interview Mode is projected in client meetings: large type, high contrast, no
hover-only information. Light and dark themes both first-class. Evidence grade must be
distinguishable without relying on colour alone.

---

## 10. Success metrics

**Product outcome**
- **Blocker discovery lead time** — share of blocker-class issues found before build
  starts rather than in UAT. The single number that justifies the product.
- **Time to first defensible question list** — from source handover to a consultant-ready
  agenda. Target: under one working day.
- **Session yield** — questions closed per hour of consultant time.
- **Rework rate** — baselined scenarios later reopened.

**Method health (shown in-product)**
- **Challenger refuted rate**, target band **10–35%**. Below 10%: the challenger is
  rubber-stamping or was leaked the analyst's reasoning. Above 35%: it is generating
  noise and burning consultant attention. Outside the band, the freeze gate warns.
- **Human edit rate on AI drafts** — near 0% means nobody is really reading; very high
  means the analyst prompt needs work. Both are signals, neither is a target of 0.
- **Citation integrity** — claims per citation that resolves to a readable page. Must be
  100% at freeze.
- **Round convergence** — new blocker questions per round should fall. Rising means the
  scope is still moving.

**Novice enablement (the goal)**
- **Ramp** — a P3 FDE with no ERP background produces a scenario reconstruction a senior
  consultant accepts with ≤ 3 corrections.
- **Unassisted completion** — a P1 consultant completes a full round without a senior
  reviewer intervening.
- **Blank-page count** — the number of places a user must compose from nothing. Target: 0
  on the critical path (N1).

---

## 11. Roadmap

| Milestone | Ships | Unblocks |
|---|---|---|
| **M0 — done** | v0.1: eight surfaces, typed domain model, seeded engagement, bilingual, themed | Method is legible and demonstrable |
| **M1 — Real repo** | Repo contract (§6), loaders replacing `src/data/*`, `/brief` wizard, git read | The record becomes real |
| **M2 — Runs & write-back** | `/runs` console, run manifests, blindness enforcement, diff accept/reject, commit-on-accept, human review fields | P2 can orchestrate; P3 is guardrailed |
| **M3 — Knowledge** | `/learn`, first domain pack, `pack-diff` run, term cards, method notes, exemplars | P3 gets business grounding; P1 gets completeness |
| **M4 — The room** | Interview Mode, offline queueing, session write-up run, `/handoff` exports | Sessions stop leaking; results reach the team |
| **M5 — Ontology** | `/ontology`, traceability from every element to its baseline evidence, abstraction API contract export | Baseline becomes buildable |
| **M6 — Agentic delivery** | `/agents`, automation decisions, guardrails, scenario-derived eval suite | The second half of the goal |

**Sequencing rule.** M2 before M3. A teaching layer over fake data teaches the wrong
lesson; the guardrails must bind on real artifacts first.

---

## 12. Risks & open questions

**Risks**

| Risk | Mitigation |
|---|---|
| **Automation complacency** — the novice trusts the rail and stops thinking; the very failure mode we're fixing, one level up | Gates require *named human* review, not a checkbox. Show unreviewed loudly. Consider spot-check prompts that ask the reviewer to justify a confirmation. |
| **Challenger theatre** — the adversarial pass becomes ceremony | The refuted-rate band is a gate, and the blindness manifest is auditable. |
| **Pack ossification** — the reference model becomes the answer instead of the question | Pack gaps are *candidates* requiring a human to promote or rule out with a rationale. Never auto-promoted. |
| **Repo divergence** — humans edit files the runs then overwrite | Runs produce diffs for accept/reject; never blind writes. Human edits are commits like any other and win by default. |
| **Residency violation** | Restricted mode blocks, not warns (§9.2). |
| **Scope drift into a PM tool** | The product's remit ends at the frozen baseline and its downstream artifacts. It does not do staffing, billing, or project plans. |

**Open questions — decide before M1**

1. **Repo hosting.** Local-only, client-hosted GitLab, or both? Determines auth and CI.
2. **Run execution model.** Does the app shell out to local Codex / Claude Code CLIs
   (matching Brief 1 literally, best for air-gapped), or call model APIs directly?
   Recommendation: CLI-first, API as an option — it keeps the on-prem story simple.
3. **Multi-engagement.** One repo per engagement with a workspace switcher, or a
   monorepo? Recommendation: one repo per engagement; packs shared as a submodule.
4. **Who owns the pack.** Is the domain pack a product asset, a delivery-team asset, or
   client IP? Affects whether engagement learnings can flow back.
5. **Transcription.** Interview Mode capture: typed, or ASR? ASR for 口水稿 is the
   whole point, but residency constraints may forbid a cloud ASR.
6. **Ontology target.** Is the M5 output a specific platform's ontology format, or a
   neutral one with exporters? The abstraction posture from Brief 1 argues for neutral.

---

## 13. Definition of done for the goal

AI-FDE has answered *"what do we need to help them do AI projects and agentic ERP
implementation and delivery?"* when all of the following hold for a real engagement:

1. A **P1 consultant** ran a complete round — ingest, reconstruct, challenge, clarify —
   without a senior reviewer, and the round produced questions a senior consultant
   agreed were the right ones.
2. A **P2 consultant** executed the multi-model pipeline without writing a prompt, and
   could explain to the client why the output is trustworthy — including what the
   challenger was not shown.
3. A **P3 FDE** reconstructed a scenario in a domain they had never worked in, and a
   senior consultant accepted it with at most three corrections.
4. The client **signed a baseline** in which every claim resolves to a readable source
   page and every agreed scenario names a human who confirmed it.
5. The build team started implementation **from the repo**, not from a re-explanation
   meeting.
6. The resulting agents were **tested against evals derived from that baseline**, and a
   failing eval traced back to the exact scenario step and citation it came from.

---

*Change this document by pull request. It is the shared contract for what AI-FDE is;
`docs/origin-prompt.md` is the authority it answers to.*
