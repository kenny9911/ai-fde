import type { Attribution, ChallengeFinding } from "@/lib/types";

const challenger = (at: string): Attribution => ({
  seat: "challenger",
  model: "Codex",
  at,
});

const analystReview = (at: string): Attribution => ({
  seat: "analyst",
  model: "Claude Opus 5",
  at,
});

/**
 * Challenge findings. The challenger runs blind to the analyst's reasoning
 * chain — it sees the sources and the conclusions, never the working. Note
 * that several findings are `refuted`: a challenger that is always right is a
 * challenger that was shown the answers.
 */
export const findings: ChallengeFinding[] = [
  {
    id: "C-001",
    code: "C-001",
    type: "contradiction",
    severity: "blocker",
    targetRef: { kind: "scenario", id: "PR-01" },
    claim: {
      en: "Requisitions are raised at material-code granularity across all departments.",
      zh: "所有部门均按物料编码颗粒度提出请购。",
    },
    challenge: {
      en: "SRC-03 at 00:00–14:00 directly contradicts this for capital construction, which raises by WBS with codes back-filled by Materials. The analyst cited only the blueprint slide and did not reconcile the transcript.",
      zh: "SRC-03 的 00:00–14:00 段就基建项目直接反驳该结论：基建按WBS申报，物料编码由物资部事后补录。分析仅引用蓝图页，未与口水稿对账。",
    },
    citations: [
      { sourceId: "SRC-03", page: 1, locator: "00:00–14:00", snippet: "实际基建项目是按WBS报的" },
      { sourceId: "SRC-01", page: 11, locator: "slide 11" },
    ],
    verdict: "upheld",
    revision: {
      en: "Claim narrowed to routine procurement; capital construction split out as a variant and escalated as Q-001.",
      zh: "结论收窄至常规采购；基建作为变体拆出，并升级为 Q-001。",
    },
    spawnedQuestionId: "Q-001",
    raisedBy: challenger("2026-07-05"),
    reviewedBy: analystReview("2026-07-06"),
    repoPath: "challenge/round-1/C-001.md",
    round: 1,
  },
  {
    id: "C-002",
    code: "C-002",
    type: "unproven-inference",
    severity: "major",
    targetRef: { kind: "step", id: "PR-05-S4" },
    claim: {
      en: "Award write-back to the ERP is a system integration.",
      zh: "中标结果回写ERP是系统集成。",
    },
    challenge: {
      en: "No source describes an interface. SRC-03 describes manual re-entry lagging two to three days, and SRC-02 slide 19 says tendering is entirely outside metaERP. The analyst appears to have modelled the desired future state as if it were the current one.",
      zh: "无任何来源描述接口。SRC-03 描述的是人工录入、滞后两三天；SRC-02 第19页称招投标完全在 metaERP 之外。分析似将期望的未来态当作现状建模。",
    },
    citations: [
      { sourceId: "SRC-03", page: 2, locator: "14:00–28:00" },
      { sourceId: "SRC-02", page: 19, locator: "slide 19" },
    ],
    verdict: "upheld",
    revision: {
      en: "Step re-labelled as a manual task in the as-is model; automation moved to a to-be decision and raised as Q-014.",
      zh: "该步骤在现状模型中改标为人工任务；自动化移至目标态决策，并提为 Q-014。",
    },
    spawnedQuestionId: "Q-014",
    raisedBy: challenger("2026-07-11"),
    reviewedBy: analystReview("2026-07-12"),
    repoPath: "challenge/round-2/C-002.md",
    round: 2,
  },
  {
    id: "C-003",
    code: "C-003",
    type: "omission",
    severity: "major",
    targetRef: { kind: "scenario", id: "PR-03" },
    claim: {
      en: "Sourcing method is determined by amount alone.",
      zh: "采购方式仅由金额决定。",
    },
    challenge: {
      en: "SRC-05 §18 places single source outside the amount ladder entirely — it has no ceiling but always requires executive approval plus an audit copy. A purely amount-driven decision table cannot express this.",
      zh: "SRC-05 第十八条将单一来源完全置于金额阶梯之外——不设上限但一律报分管领导并抄送监察审计。纯金额决策表无法表达该规则。",
    },
    citations: [{ sourceId: "SRC-05", page: 12, locator: "§18" }],
    verdict: "upheld",
    revision: {
      en: "Decision model changed from a single amount ladder to amount ladder plus a justification-driven override path.",
      zh: "决策模型由单一金额阶梯改为金额阶梯 + 理由驱动的例外路径。",
    },
    raisedBy: challenger("2026-07-11"),
    reviewedBy: analystReview("2026-07-13"),
    repoPath: "challenge/round-2/C-003.md",
    round: 2,
  },
  {
    id: "C-004",
    code: "C-004",
    type: "contradiction",
    severity: "blocker",
    targetRef: { kind: "step", id: "PR-04-S2" },
    claim: {
      en: "Suppliers are admitted to the approved list scoped by material category.",
      zh: "供应商按物料大类纳入合格供应商名录。",
    },
    challenge: {
      en: "SRC-02 slide 24 states metaERP supplier master is globally unique and standard qualification does not segment by material category. The business requirement and the target package are in direct conflict; the analysis recorded the business side without noting the conflict.",
      zh: "SRC-02 第24页明确 metaERP 供应商主数据全局唯一、标准资质不按物料大类分段。业务要求与目标套件直接冲突；分析仅记录了业务侧，未标注冲突。",
    },
    citations: [
      { sourceId: "SRC-01", page: 23, locator: "slide 23" },
      { sourceId: "SRC-02", page: 24, locator: "slide 24" },
    ],
    verdict: "upheld",
    revision: {
      en: "Step evidence grade downgraded to `contradicted`; conflict escalated as Q-011 with two costed options.",
      zh: "该步骤证据等级下调为“矛盾”；冲突升级为 Q-011，并给出两个带代价的选项。",
    },
    spawnedQuestionId: "Q-011",
    raisedBy: challenger("2026-07-12"),
    reviewedBy: analystReview("2026-07-12"),
    repoPath: "challenge/round-2/C-004.md",
    round: 2,
  },
  {
    id: "C-005",
    code: "C-005",
    type: "unsupported-citation",
    severity: "minor",
    targetRef: { kind: "step", id: "PR-05-S2" },
    claim: {
      en: "Expert draw is videotaped end to end and evaluation is under closed-door management.",
      zh: "专家抽取全程录像，评标期间实行封闭管理。",
    },
    challenge: {
      en: "Cited to SRC-05 §29, which does support it verbatim. Raised initially because the analyst also attached SRC-01 slide 23, which is about supplier qualification and has nothing to do with expert draw.",
      zh: "引用 SRC-05 第二十九条，原文确实支持该结论。之所以提出，是因为分析同时引用了 SRC-01 第23页，而该页讲的是供应商准入，与专家抽取无关。",
    },
    citations: [{ sourceId: "SRC-05", page: 21, locator: "§29" }],
    verdict: "refuted",
    revision: {
      en: "Claim stands. The spurious second citation was removed; the finding did not affect the conclusion.",
      zh: "结论成立。已删除误加的第二条引用；该发现不影响结论本身。",
    },
    raisedBy: challenger("2026-07-12"),
    reviewedBy: analystReview("2026-07-13"),
    repoPath: "challenge/round-2/C-005.md",
    round: 2,
  },
  {
    id: "C-006",
    code: "C-006",
    type: "omission",
    severity: "blocker",
    targetRef: { kind: "scenario", id: "PR-09" },
    claim: {
      en: "Inspection concludes in pass or fail.",
      zh: "验收结论为合格或不合格。",
    },
    challenge: {
      en: "Both SRC-01 slide 31 and SRC-03 name a third outcome — concession acceptance with executive sign-off — which the reconstructed flow omitted entirely. A two-branch model silently drops a real path that has different downstream settlement behaviour.",
      zh: "SRC-01 第31页与 SRC-03 均提到第三种结论——需分管领导签批的让步接收，而还原的流程完全遗漏。二分支模型静默丢失了一条结算行为不同的真实路径。",
    },
    citations: [
      { sourceId: "SRC-01", page: 31, locator: "slide 31" },
      { sourceId: "SRC-03", page: 3, locator: "28:00–41:00" },
    ],
    verdict: "upheld",
    revision: {
      en: "Third branch added with role binding to R-12; concession confirmed in session S-03.",
      zh: "增加第三分支并绑定 R-12 角色；让步接收已在 S-03 会议确认。",
    },
    raisedBy: challenger("2026-07-12"),
    reviewedBy: analystReview("2026-07-14"),
    repoPath: "challenge/round-2/C-006.md",
    round: 2,
  },
  {
    id: "C-007",
    code: "C-007",
    type: "unproven-inference",
    severity: "major",
    targetRef: { kind: "scenario", id: "PR-10" },
    claim: {
      en: "Tolerance auto-release is disabled because group policy forbids it.",
      zh: "容差自动放行被关闭，是因为集团政策禁止。",
    },
    challenge: {
      en: "SRC-04 screen 9 shows only that the checkbox is greyed out. No source states why. 'Group policy forbids it' is an invented explanation — it may equally be an unlicensed feature, a misconfiguration, or a local decision.",
      zh: "SRC-04 第9屏仅显示该勾选项灰置，无任何来源说明原因。“集团政策禁止”属臆测——同样可能是未授权功能、配置错误或本地决定。",
    },
    citations: [{ sourceId: "SRC-04", page: 9, locator: "screen 9" }],
    verdict: "upheld",
    revision: {
      en: "Explanation removed. Observation retained as fact; cause raised as Q-026 for the consultant.",
      zh: "删除该解释。保留现象为事实；原因作为 Q-026 交顾问澄清。",
    },
    spawnedQuestionId: "Q-026",
    raisedBy: challenger("2026-07-20"),
    reviewedBy: analystReview("2026-07-21"),
    repoPath: "challenge/round-3/C-007.md",
    round: 3,
  },
  {
    id: "C-008",
    code: "C-008",
    type: "omission",
    severity: "blocker",
    targetRef: { kind: "scenario", id: "PR-11" },
    claim: {
      en: "Payment follows directly from a cleared three-way match.",
      zh: "三单匹配通过后直接进入付款。",
    },
    challenge: {
      en: "SRC-03 at 41:00 describes a budget re-check between match and payment request that appears in no blueprint. The reconstructed flow inherited the blueprint's omission rather than the transcript's reality.",
      zh: "SRC-03 的 41:00 段描述了匹配与付款申请之间的预算复核，蓝图中并无记载。还原流程继承了蓝图的遗漏，而非口水稿的现实。",
    },
    citations: [{ sourceId: "SRC-03", page: 4, locator: "41:00–55:00" }],
    verdict: "upheld",
    revision: {
      en: "Budget re-check added as PR-11 step 1; whether it is a formal control raised as Q-028.",
      zh: "预算复核补入 PR-11 第1步；是否为正式控制点提为 Q-028。",
    },
    spawnedQuestionId: "Q-028",
    raisedBy: challenger("2026-07-20"),
    reviewedBy: analystReview("2026-07-21"),
    repoPath: "challenge/round-3/C-008.md",
    round: 3,
  },
  {
    id: "C-009",
    code: "C-009",
    type: "scope-creep",
    severity: "minor",
    targetRef: { kind: "work-item", id: "W-22" },
    claim: {
      en: "A prepayment guarantee ledger object is required in phase 1.",
      zh: "预付款保函台账对象须纳入一期。",
    },
    challenge: {
      en: "The transcript mentions a manual ledger, not a requirement. Nothing in the blueprint, regulation or category sheet asks for it to be systematised. Introducing the object without a scope decision expands phase 1 unilaterally.",
      zh: "口水稿提到的是手工台账，而非需求。蓝图、制度与品类表均未要求将其系统化。未经范围决策即引入该对象，等于单方面扩大一期范围。",
    },
    citations: [{ sourceId: "SRC-03", page: 4, locator: "41:00–55:00" }],
    verdict: "needs-clarification",
    revision: {
      en: "Work item retained but flagged for an explicit in/out scope decision; raised as Q-029.",
      zh: "保留该 work item 但标记需明确纳入/排除范围决策；提为 Q-029。",
    },
    spawnedQuestionId: "Q-029",
    raisedBy: challenger("2026-07-26"),
    repoPath: "challenge/round-3/C-009.md",
    round: 3,
  },
  {
    id: "C-010",
    code: "C-010",
    type: "unproven-inference",
    severity: "major",
    targetRef: { kind: "scenario", id: "PR-12" },
    claim: {
      en: "Contract changes above 10% do not affect purchase orders already issued.",
      zh: "超10%的合同变更不影响已下达的采购订单。",
    },
    challenge: {
      en: "SRC-01 slide 45 is explicit that it does not address this — the analyst's own extraction note says so. Absence of a statement is being read as a statement of absence.",
      zh: "SRC-01 第45页明确未涉及此点——分析自己的提取备注即如此记载。把“未说明”读成了“说明不影响”。",
    },
    citations: [
      { sourceId: "SRC-01", page: 45, locator: "slide 45", snippet: "（未说明变更是否影响已下达订单）" },
    ],
    verdict: "open",
    raisedBy: challenger("2026-07-26"),
    repoPath: "challenge/round-3/C-010.md",
    round: 3,
  },
];
