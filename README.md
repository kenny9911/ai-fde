# AI-FDE

**AI Ontology Architect · Ontology Consultant · AI Analyst for ERP engagements.**

AI-FDE assists human ERP consultants and human FDEs in turning raw engagement
material — decks, screenshots, transcripts, regulations, system exports — into a
**defensible, evidence-backed Business Understanding Baseline** that a client can
sign and an ontology team can build from.

It sits *before* ontology authoring. Its output is the frozen understanding that
downstream Object / Rule / Action / Event modelling depends on.

---

## Docs

| File | What it is |
|---|---|
| [`docs/origin-prompt.md`](docs/origin-prompt.md) | The verbatim founding briefs, and what each line of them fixes permanently |
| [`docs/product-design-spec.md`](docs/product-design-spec.md) | Product design & specification — personas, surface specs, repo contract, type extensions, roadmap. **Start here for new work.** |

This README describes what is built (v0.1). The spec describes what is being built.

---

## Run it

```bash
pnpm install          # or npm install
pnpm dev              # http://localhost:4100
pnpm build && pnpm start
pnpm typecheck
```

Node ≥ 20. Next.js 16 · React 19 · Tailwind v4 · TypeScript 6.

Self-contained by design: its own dependency tree, its own vendored UI layer, its
own design tokens and i18n. No network fonts, no external services, no database,
no shared component library — the seeded engagement is compiled in, so a clean
clone runs with nothing but `install` and `dev`.

---

## The method it encodes

The product is a UI for a specific analysis loop. Each phase has its own surface,
and the surfaces are deliberately not interchangeable.

| # | Phase | Seat | Surface | What it produces |
|---|---|---|---|---|
| 1 | **Ingest & Index** | Extractor | `/sources` | Every artifact as tracked files with a page-level source index, plus an honest completeness report |
| 2 | **Reconstruct Understanding** | Analyst | `/understanding` | Scenarios, reconstructed workflows, roles, work items — each claim carrying citations |
| 3 | **Independent Challenge** | Challenger | `/challenge` | Omissions, contradictions and unproven inferences, raised by a second model blind to the analyst's reasoning |
| 4 | **Consultant Clarification** | Human | `/questions`, `/sessions` | A question list the consultant can actually work, and verbatim answers written back |
| 5 | **Freeze Baseline** | Synthesizer | `/baseline` | Scope lock, measurable quality gates, signed immutable baseline |

`/capabilities` cuts across all five: the abstraction map between the ontology and
the underlying ERP.

### Three invariants

Every type in `src/lib/types.ts` is shaped by these, and every surface enforces them.

1. **Evidence or it didn't happen.** Every claim carries `citations` back to a
   specific page of a specific source. A claim with no citation is an *inference*
   and is labelled as one — `stated` / `inferred` / `assumed` / `contradicted` is a
   first-class field, not a comment.
2. **Attribution is visible.** The method rests on model diversity: the analyst and
   the challenger are deliberately different models in different seats. Who said
   what is never flattened into an anonymous "AI said". The challenge board shows
   the **refuted** count precisely because a challenger that is never wrong is a
   challenger that was shown the answers.
3. **Git is the system of record.** Every artifact knows its `repoPath`. The UI is a
   lens over tracked files, not a database with a git export button.

### Design decisions worth knowing

- **Questions state consequence, not curiosity.** Every question's `whyItMatters`
  is phrased as *what cannot be modelled until this is answered*, so a consultant
  triages by impact rather than by whoever asked loudest.
- **Pre-drafted options.** Questions ship with costed options where possible. The
  consultant picks and corrects rather than composing from scratch.
- **Gates are measurable, and they name their offenders.** Every failing gate on
  `/baseline` links straight to the specific question, scenario, finding or source
  page failing it. Quality you cannot point at is an opinion, not a gate.
- **Readiness is derived, never asserted.** The headline percentage is computed
  from the gates themselves in `computeMetrics()`, so a tile can never disagree
  with the gate below it.
- **The seed data is imperfect on purpose.** Unreadable slides, un-analysed pages,
  contradictions between the blueprint and the transcript, and one challenger
  finding that was *refuted*. A demo where the pipeline is clean teaches the wrong
  thing about what this work is like.
- **Bilingual by construction.** Every domain string is a `Bilingual { en, zh }` in
  the data itself — the locale switch is a field selector, not a translation
  lookup. The client reviews in Chinese; the delivery team builds in English.

---

## The seeded engagement

Procurement for a provincial subsidiary of a state-owned power grid operator,
moving onto **Huawei metaERP behind an abstraction API**.

Twelve scenarios spanning the full lifecycle — 需求申报 → 采购计划 → 采购方式确定 →
供应商准入 → 招标与开评定标 → 竞争性谈判/单一来源 → 合同签订 → 订单下达 →
收货验收 → 三单匹配 → 付款结算 → 变更退货索赔 — with 14 roles, 13 work items,
6 sources, 15 clarification questions, 10 challenge findings, 4 sessions and
19 capability bindings.

The genuinely interesting content is in the conflicts, and they are the kind that
decide architecture:

- The blueprint says requisitions are raised by material code; the transcript says
  capital construction raises by WBS and Materials back-fills codes later.
- The business needs supplier qualification scoped per material category; metaERP's
  supplier master is globally unique and cannot segment that way.
- Tendering happens entirely outside metaERP, and the award result comes back by
  manual re-entry lagging two to three days.
- A pre-payment budget re-check exists in practice and appears in no blueprint or
  regulation — so it is either a real control or an accident, and modelling it
  either way is a decision.
- Slide 42, the exception-handling flowchart, is an unreadable 96dpi hand-drawn
  image, which is why the change/return scenario sits at 41% source coverage and
  blocks the freeze.

---

## Layout

```
src/
  app/                    # Routes — one directory per surface
    page.tsx              #   / — engagement overview, the loop, attention, activity
    sources/              #   evidence corpus + page-level extraction
    understanding/        #   scenarios, roles, work items; scenario detail
    challenge/            #   claim / rebuttal / revision triptych
    questions/            #   clarification board + question detail
    sessions/             #   consultant sessions, verbatim excerpts, deltas
    capabilities/         #   ontology → abstraction API → metaERP bindings
    baseline/             #   freeze gates, scope decisions, sign-off
  components/
    app-shell.tsx         # sidebar, top bar, PageHeader
    ui.tsx                # Badge, Button, Card, ConfidenceBar, Meter, Tabs, RepoPath…
    chips.tsx             # domain chips: seat, evidence, verdict, severity, citations
    claim-triptych.tsx    # the challenge exchange, shown in full
  data/                   # The seeded engagement (see index.ts for selectors)
  lib/
    types.ts              # the domain model — start here
    i18n.tsx              # tiny bilingual layer
    labels.ts             # bilingual taxonomy labels and count phrases
  styles/globals.css      # OKLCH tokens, light + dark, phase hues
```

### Wiring a real LLM

Nothing in the app calls a model — the pipeline output is seeded. To make it live,
replace the `src/data/*` modules with loaders over your analysis repository and run
the extractor / analyst / challenger passes against it. The types in
`src/lib/types.ts` are the contract those passes must produce; every field the UI
renders, including citations, evidence grade, attribution and repo path, is
something the pipeline is expected to emit rather than something the UI invents.
