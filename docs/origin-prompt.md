# Origin Prompt — AI-FDE

The verbatim briefs that created this product. Preserved unedited (including the
original Chinese) because every later design decision traces back to them. When a
spec decision is questioned, this is the authority.

---

## Brief 1 — the founding prompt

> Recorded verbatim. This is the prompt that produced commit `04b49b6`
> (*feat: AI-FDE — AI Ontology Architect for ERP engagements*) and the eight
> surfaces of v0.1.

```text
Goal: Design the user experience and frontend for AI-FDE, it is an AI Ontology
Architect, Ontology consultant, and AI analyst, it assists human ERP consultants
and human FDEs to clarify and build the actionable ontology for the ERP project.

#AI-FDE 第一步:

1、先建立一个"业务分析项目仓库"：建立一个 Git 项目，把 PPT、页面、分析结果、问题和顾问答案、
会议口水稿 都变成可追踪文件。

2、Codex 和 Claude Code 两个一起用（切记：用最好的模型），Codex 做 PPT 提取、页面渲染、
文件结构、来源索引、完整性检查、交叉验证。

Claude Code 做逐页理解、场景识别、工作流还原、角色和 work item 识别、找出业务缺口(gap)
—-> 形成需求澄清问题清单。

然后再用 Codex 做 "challenger"，不受 Claude 结论影响，独立检查流程遗漏、矛盾和未经证实的
推论，再把结果给 Claude Code (Opus5) 痛改。

ERP 顾问：以上准备好后，找 ERP 顾问逐步澄清问题，所有记录要入到 git 项目。

把 ERP 顾问的输入再喂给 Claude Code Opus5 去整理和完善，再找出是否还有需要澄清的点。
再 repeat ERP 顾问步骤。

** 控制范围、判断分析质量、冻结业务理解基线 ** lock down scope.

最终结果给到参与团队工作群做分享，所有文档以在 git 为主。

——

* use complete purchase scenarios for a state-owned electricity and grid company.
* based on Huawei metaERP with an api abstraction to underlying metaERP.
```

### What Brief 1 fixes, permanently

| Decision | Consequence for the product |
|---|---|
| Git project as the "业务分析项目仓库" | Git is the system of record. Every artifact has a `repoPath`. The UI is a lens over tracked files. |
| PPT、页面、分析结果、问题和顾问答案、会议口水稿 → 可追踪文件 | Five artifact families, all versioned: sources, extracted pages, understanding, Q&A, session transcripts. |
| Codex **and** Claude Code together, best models only | Multi-model by construction, not one chatbot. Seats are a first-class concept. |
| Codex: extraction, rendering, file structure, source index, completeness, cross-validation | The **extractor** seat. |
| Claude Code: per-page reading, scenario identification, workflow reconstruction, roles + work items, gap-finding → question list | The **analyst** seat. |
| Codex as challenger, 不受 Claude 结论影响 | The **challenger** seat, and the blindness rule: the challenger must not see the analyst's reasoning. |
| 再把结果给 Claude Code (Opus5) 痛改 | Revision is a distinct, attributed act — not a silent edit. |
| ERP 顾问逐步澄清，所有记录入 git | The human clarification loop, captured verbatim. |
| 再 repeat ERP 顾问步骤 | Rounds. Every artifact carries a `round` number. |
| 控制范围、判断分析质量、冻结业务理解基线 | Scope control + measurable quality + an explicit freeze. The `/baseline` gate. |
| 最终结果给到参与团队工作群做分享 | A shareable handoff pack is part of the deliverable, not an afterthought. |
| State-owned electricity/grid company, complete purchase scenarios | The seeded engagement domain, and the data-residency constraints that come with an SOE client. |
| Huawei metaERP behind an API abstraction | The ontology never hard-codes a vendor endpoint. `/capabilities` is the only place metaERP leaks in. |

---

## Brief 2 — the goal and the target user

> Recorded verbatim. This brief is what `docs/product-design-spec.md` is written
> against.

```text
below was my first prompt to create this product ai-fde. Please save this original
prompt and create a product design and spec markdown file for this product now. We
will use for the further development. The target user is inexperienced ERP consultant
and FDEs, ERP consultants who are not familiar with using AI tools effectively, and
the FDEs who are young and lack of business system and business understanding.

THIS WILL BE THE GOAL for AI-FDE "So what do we need to help them to do the AI
projects and agentic ERP project implementation and delivery?"
```

### What Brief 2 changes

Brief 1 described a **method**. Brief 2 names the **user who cannot execute that
method unaided**, and extends the destination from *a signed baseline* to
*agentic ERP implementation and delivery*.

Three target users, three different deficits:

1. **Inexperienced ERP consultants** — lack the method. They don't know what a
   complete analysis looks like, so they don't know when they are done.
2. **ERP consultants unfamiliar with AI tools** — have the domain knowledge but
   cannot orchestrate models. They use AI as a chatbot, get plausible prose, and
   have no way to verify it.
3. **Young FDEs** — can drive the models but lack business-system and business
   understanding. They cannot tell a plausible-but-wrong workflow from a correct
   one, which is the exact failure mode AI is best at producing.

The product is therefore not "an AI that does the analysis." It is a **harness that
lets these three people execute a senior consultant's method and produce work a
client will sign**.
