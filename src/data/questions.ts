import type { Attribution, Question } from "@/lib/types";

const byAnalyst = (at: string): Attribution => ({
  seat: "analyst",
  model: "Claude Opus 5",
  at,
});

const byChallenger = (at: string): Attribution => ({
  seat: "challenger",
  model: "Codex",
  at,
});

/**
 * The clarification question list — the artifact the human ERP consultant
 * actually works. Every question states what cannot be modelled until it is
 * answered, so the consultant can triage by consequence rather than by whoever
 * shouted loudest.
 */
export const questions: Question[] = [
  {
    id: "Q-001",
    code: "Q-001",
    question: {
      en: "Is a requisition raised at material-code granularity, or at project WBS level for capital construction?",
      zh: "请购的最小颗粒度是物料编码，还是基建项目按WBS申报？",
    },
    whyItMatters: {
      en: "The blueprint says material code; the transcript says capital projects use WBS and Materials back-fills codes later. Until this is settled, Purchase_Requisition cannot have a stable primary key or a valid relationship to Project.",
      zh: "蓝图称按物料编码，口水稿称基建按WBS申报、物料编码事后补录。此点不定，请购单对象无法确定主键，也无法确定与项目对象的关系。",
    },
    category: "data-definition",
    severity: "blocker",
    status: "answered",
    repoPath: "analysis/questions/Q-001.md",
    blocks: ["PR-01", "W-01"],
    citations: [
      { sourceId: "SRC-01", page: 11, locator: "slide 11" },
      { sourceId: "SRC-03", page: 1, locator: "00:00–14:00", snippet: "实际基建项目是按WBS报的" },
    ],
    options: [
      {
        label: { en: "Always material code; WBS is an attribute", zh: "统一按物料编码，WBS作为属性" },
        implication: { en: "Single requisition object; capital construction needs a mandatory WBS field.", zh: "单一请购对象；基建场景下WBS字段必填。" },
      },
      {
        label: { en: "Two requisition types with different keys", zh: "两类请购单，主键不同" },
        implication: { en: "Requisition specialises into Routine and Project subtypes; downstream consolidation must handle both.", zh: "请购对象分为常规与项目两个子类型；归集逻辑需兼容两者。" },
      },
    ],
    answer: {
      text: {
        en: "Both exist. Capital construction raises by WBS first and Materials completes the material code before consolidation. Treat material code as mandatory at consolidation, optional at raise.",
        zh: "两者都存在。基建先按WBS申报，物资部在归集前补全物料编码。物料编码在归集环节必填，在申报环节可空。",
      },
      answeredBy: "Wang Lei",
      answeredAt: "2026-07-26",
      sessionId: "S-03",
      resultingChanges: [
        { en: "PR-01 step 1 split into raise and code-completion", zh: "PR-01 第1步拆分为申报与编码补全" },
        { en: "material_code marked conditionally required on Purchase_Requisition", zh: "请购单 material_code 标记为条件必填" },
      ],
    },
    followUpIds: ["Q-031"],
    raisedBy: byAnalyst("2026-07-02"),
    round: 1,
  },
  {
    id: "Q-002",
    code: "Q-002",
    question: {
      en: "What is the amount threshold below which sporadic procurement may bypass batch consolidation?",
      zh: "零星采购可绕过批次归集的金额阈值是多少？",
    },
    whyItMatters: {
      en: "The blueprint names a 'green channel' but never states a number. SRC-06 mentions ¥100k for auxiliary materials only. Without the rule, the routing decision in PR-01 cannot be automated.",
      zh: "蓝图提及“绿色通道”但未给出数值，SRC-06 仅提到零星辅材10万元。规则不明则 PR-01 的路由判断无法自动化。",
    },
    category: "authority",
    severity: "major",
    status: "answered",
    repoPath: "analysis/questions/Q-002.md",
    blocks: ["PR-01"],
    citations: [
      { sourceId: "SRC-01", page: 11, locator: "slide 11" },
      { sourceId: "SRC-06", page: 1, locator: "sheet 1" },
    ],
    answer: {
      text: {
        en: "¥100,000 per requisition for auxiliary materials, department self-procurement. Primary and secondary equipment never bypasses consolidation regardless of amount.",
        zh: "辅材单张请购10万元以下由部门自行采购。一次、二次设备无论金额均不得绕过归集。",
      },
      answeredBy: "Wang Lei",
      answeredAt: "2026-07-26",
      sessionId: "S-03",
      resultingChanges: [
        { en: "Added category-conditional threshold rule to PR-01", zh: "为 PR-01 增加按品类的条件阈值规则" },
      ],
    },
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-02"),
    round: 1,
  },
  {
    id: "Q-007",
    code: "Q-007",
    question: {
      en: "When a tender fails and the sourcing method changes, must the sourcing-method approval be re-executed?",
      zh: "废标后改变采购方式，是否需要重新履行采购方式审批？",
    },
    whyItMatters: {
      en: "The transcript states practice differs by province. This decides whether Sourcing_Method_Approval is a one-shot record or a versioned object with re-approval events.",
      zh: "口水稿明确称各省做法不一。此点决定采购方式审批是一次性记录，还是带重新审批事件的版本化对象。",
    },
    category: "authority",
    severity: "blocker",
    status: "asked",
    repoPath: "analysis/questions/Q-007.md",
    blocks: ["PR-03", "PR-05"],
    citations: [
      { sourceId: "SRC-03", page: 2, locator: "14:00–28:00", snippet: "废标重招的时候，采购方式要不要重新审批，各省做法不一样" },
    ],
    options: [
      {
        label: { en: "Always re-approve", zh: "一律重新审批" },
        implication: { en: "Cleanest audit trail; adds cycle time to every failed tender.", zh: "审计链路最清晰；每次废标都增加周期。" },
      },
      {
        label: { en: "Re-approve only when moving to a less competitive method", zh: "仅当转向竞争性更弱的方式时重新审批" },
        implication: { en: "Requires a ranked ordering of methods in the ontology.", zh: "需要在本体中为采购方式定义竞争性排序。" },
      },
    ],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-08"),
    round: 2,
  },
  {
    id: "Q-011",
    code: "Q-011",
    question: {
      en: "Is supplier qualification valid globally, or scoped per material category?",
      zh: "供应商准入结果是全局有效，还是按物料大类分段有效？",
    },
    whyItMatters: {
      en: "The business says category-scoped with two-year validity. metaERP supplier master is globally unique and its standard Qualification field does not segment by material category. This is a direct business-vs-package conflict that decides whether we need an extension object.",
      zh: "业务称按大类维护、两年有效；metaERP 供应商主数据全局唯一，标准资质字段不支持按物料大类分段。此为业务与套件的直接冲突，决定是否需要扩展对象。",
    },
    category: "integration",
    severity: "blocker",
    status: "asked",
    repoPath: "analysis/questions/Q-011.md",
    blocks: ["PR-04", "W-11"],
    citations: [
      { sourceId: "SRC-01", page: 23, locator: "slide 23" },
      { sourceId: "SRC-02", page: 24, locator: "slide 24", snippet: "标准字段不支持按物料大类分段有效" },
    ],
    options: [
      {
        label: { en: "Extend metaERP supplier with a category-qualification child object", zh: "扩展供应商对象，增加品类资质子对象" },
        implication: { en: "Custom development; full fidelity to current business practice.", zh: "需定制开发；完全保留现行业务实践。" },
      },
      {
        label: { en: "Adopt PurchasingOrg scoping and reorganise categories to match", zh: "采用采购组织维度，并按其重组品类" },
        implication: { en: "Standard package; requires a business process change and category remapping.", zh: "标准套件；需变更业务流程并重新映射品类。" },
      },
    ],
    followUpIds: [],
    raisedBy: byChallenger("2026-07-12"),
    round: 2,
  },
  {
    id: "Q-014",
    code: "Q-014",
    question: {
      en: "Should the award result flow back from the e-commerce platform automatically, and who owns the interface contract?",
      zh: "中标结果是否应从电子商务平台自动回写？接口契约由谁负责？",
    },
    whyItMatters: {
      en: "Today this is manual re-entry lagging two to three days — the single largest latency in the sourcing chain. Whether we model an inbound integration event or a human task changes PR-05 fundamentally.",
      zh: "目前为人工录入、滞后两三天，是寻源链路最大的时延来源。建模为入站集成事件还是人工任务，将根本改变 PR-05。",
    },
    category: "integration",
    severity: "blocker",
    status: "resolved",
    repoPath: "analysis/questions/Q-014.md",
    blocks: ["PR-05"],
    citations: [
      { sourceId: "SRC-03", page: 2, locator: "14:00–28:00" },
      { sourceId: "SRC-02", page: 19, locator: "slide 19" },
    ],
    answer: {
      text: {
        en: "Yes — automatic write-back is in scope for phase 1. The e-commerce platform team owns the outbound contract; we consume it through the abstraction API as an AwardRecorded event.",
        zh: "是——自动回写纳入一期范围。电子商务平台团队负责出站契约，我方通过抽象API以 AwardRecorded 事件消费。",
      },
      answeredBy: "Chen Yu",
      answeredAt: "2026-07-26",
      sessionId: "S-03",
      resultingChanges: [
        { en: "PR-05 step 4 re-modelled as an integration event", zh: "PR-05 第4步改建模为集成事件" },
        { en: "Added capability sourcing.award.record with bound status", zh: "新增能力 sourcing.award.record 并标记为已绑定" },
      ],
    },
    followUpIds: ["Q-016"],
    raisedBy: byAnalyst("2026-07-08"),
    round: 2,
  },
  {
    id: "Q-016",
    code: "Q-016",
    question: {
      en: "What is the reconciliation rule if the platform's award result conflicts with an already-created contract?",
      zh: "若平台回写的中标结果与已创建的合同不一致，如何对账处理？",
    },
    whyItMatters: {
      en: "Once write-back is automatic, a late correction from the platform can arrive after the contract exists. Without a rule, the ontology has no defined resolution for the conflict.",
      zh: "自动回写后，平台的迟到更正可能在合同创建之后到达。无规则则本体对该冲突无确定的解决路径。",
    },
    category: "exception-path",
    severity: "major",
    status: "draft",
    repoPath: "analysis/questions/Q-016.md",
    blocks: ["PR-05", "PR-07"],
    citations: [{ sourceId: "SRC-03", page: 2, locator: "14:00–28:00" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-27"),
    round: 3,
  },
  {
    id: "Q-018",
    code: "Q-018",
    question: {
      en: "On inspection failure, is the goods receipt reversed, or is a separate return document created?",
      zh: "验收不合格时，是冲销收货单，还是生成独立的退货单？",
    },
    whyItMatters: {
      en: "This determines whether Goods_Receipt is mutable and whether the three-way match re-runs against a changed receipt or a compensating document. It propagates directly into PR-10 and PR-12.",
      zh: "此点决定收货单是否可变，以及三单匹配是针对被修改的收货单还是补偿单据重跑，直接影响 PR-10 与 PR-12。",
    },
    category: "exception-path",
    severity: "blocker",
    status: "answered",
    repoPath: "analysis/questions/Q-018.md",
    blocks: ["PR-09", "PR-10", "PR-12"],
    citations: [
      { sourceId: "SRC-03", page: 3, locator: "28:00–41:00", snippet: "收货单要冲销，冲销单据在系统里挺麻烦的" },
    ],
    options: [
      {
        label: { en: "Reverse the goods receipt", zh: "冲销收货单" },
        implication: { en: "Matches current practice; goods receipt becomes mutable and audit history is harder.", zh: "符合现状；收货单变为可变，审计追溯更困难。" },
      },
      {
        label: { en: "Issue a compensating return document", zh: "生成补偿性退货单" },
        implication: { en: "Immutable receipts; cleaner ontology; a change to how the warehouse works today.", zh: "收货单不可变，本体更清晰；但改变仓储现行做法。" },
      },
    ],
    answer: {
      text: {
        en: "Move to a compensating return document. The reversal approach is a legacy workaround and Finance has been asking to drop it. Warehouse agrees provided the return document auto-populates from the receipt.",
        zh: "改为补偿性退货单。冲销是遗留变通做法，财务一直希望取消。仓储同意，前提是退货单可从收货单自动带出。",
      },
      answeredBy: "Wang Lei",
      answeredAt: "2026-07-26",
      sessionId: "S-03",
      resultingChanges: [
        { en: "PR-09 variant marked resolved; PR-12 step 2 upgraded from assumed to stated", zh: "PR-09 变体标记为已解决；PR-12 第2步由假设升级为明确" },
        { en: "Goods_Receipt modelled as immutable", zh: "收货单建模为不可变对象" },
      ],
    },
    followUpIds: ["Q-033"],
    raisedBy: byAnalyst("2026-07-10"),
    round: 2,
  },
  {
    id: "Q-019",
    code: "Q-019",
    question: {
      en: "For single-source procurement, what evidence must accompany the uniqueness rationale?",
      zh: "单一来源采购的唯一性理由需附哪些证明材料？",
    },
    whyItMatters: {
      en: "Discipline & Audit reviews every single-source case. Without knowing the required evidence set, the approval object cannot define its mandatory attachments.",
      zh: "监察审计部逐案审查单一来源。不明确所需材料清单，审批对象无法定义必备附件。",
    },
    category: "compliance",
    severity: "minor",
    status: "deferred",
    repoPath: "analysis/questions/Q-019.md",
    blocks: ["PR-06"],
    citations: [{ sourceId: "SRC-05", page: 12, locator: "§18" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-14"),
    round: 2,
  },
  {
    id: "Q-022",
    code: "Q-022",
    question: {
      en: "Does concession acceptance affect payment terms or the settlement clock?",
      zh: "让步接收是否影响账期或结算计时？",
    },
    whyItMatters: {
      en: "The transcript says payment proceeds normally, but if a price deduction is negotiated the invoice will not match the order. That is a three-way match variance with no defined handling.",
      zh: "口水稿称按正常付款处理，但若协商减价则发票与订单不符，将产生无既定处理方式的三单匹配差异。",
    },
    category: "process-gap",
    severity: "major",
    status: "answered",
    repoPath: "analysis/questions/Q-022.md",
    blocks: ["PR-09", "PR-12"],
    citations: [{ sourceId: "SRC-03", page: 3, locator: "28:00–41:00" }],
    answer: {
      text: {
        en: "Settlement clock is unaffected. A price deduction, when agreed, is handled as a contract change (PR-12) before invoicing — never as a match variance.",
        zh: "结算计时不受影响。若协商减价，在开票前按合同变更（PR-12）处理，不作为匹配差异。",
      },
      answeredBy: "Wang Lei",
      answeredAt: "2026-07-26",
      sessionId: "S-03",
      resultingChanges: [
        { en: "Added dependency edge PR-09 → PR-12 for concession with deduction", zh: "新增 PR-09 → PR-12 的让步减价依赖边" },
      ],
    },
    followUpIds: [],
    raisedBy: byChallenger("2026-07-12"),
    round: 2,
  },
  {
    id: "Q-024",
    code: "Q-024",
    question: {
      en: "Which contract fields are authoritative for payment terms — contract header, or per-line?",
      zh: "账期以合同抬头字段为准，还是行项目为准？",
    },
    whyItMatters: {
      en: "Framework agreements for cable cover many call-offs with potentially different terms. Header-only modelling would silently lose per-line variation.",
      zh: "线材电缆框架协议涵盖多次订单，账期可能不同。仅按抬头建模会静默丢失行级差异。",
    },
    category: "data-definition",
    severity: "major",
    status: "asked",
    repoPath: "analysis/questions/Q-024.md",
    blocks: ["PR-07", "PR-11"],
    citations: [{ sourceId: "SRC-06", page: 1, locator: "sheet 1" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-16"),
    round: 2,
  },
  {
    id: "Q-026",
    code: "Q-026",
    question: {
      en: "Is the three-way match tolerance group-uniform, or configurable per provincial company?",
      zh: "三单匹配容差是集团统一，还是省公司可配置？",
    },
    whyItMatters: {
      en: "metaERP configures tolerance per CompanyCode, so the package can do either. The governance answer decides whether tolerance is ontology configuration or a per-domain parameter.",
      zh: "metaERP 按 CompanyCode 配置容差，两种都能支持。治理口径决定容差是本体配置项还是按域参数。",
    },
    category: "authority",
    severity: "major",
    status: "asked",
    repoPath: "analysis/questions/Q-026.md",
    blocks: ["PR-10"],
    citations: [{ sourceId: "SRC-02", page: 15, locator: "slide 15" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-16"),
    round: 2,
  },
  {
    id: "Q-028",
    code: "Q-028",
    question: {
      en: "Is the pre-payment budget re-check a formal control, and who owns it?",
      zh: "付款前的预算复核是否为正式控制点？由谁负责？",
    },
    whyItMatters: {
      en: "It exists in practice but appears in no blueprint or regulation. If it is a real control it must be modelled as an approval step; if it is informal habit, modelling it would freeze an accident into the ontology.",
      zh: "实际存在但蓝图与制度均未记载。若为真实控制点须建模为审批步骤；若只是非正式习惯，建模会把偶然固化进本体。",
    },
    category: "process-gap",
    severity: "blocker",
    status: "asked",
    repoPath: "analysis/questions/Q-028.md",
    blocks: ["PR-11"],
    citations: [
      { sourceId: "SRC-03", page: 4, locator: "41:00–55:00", snippet: "中间还有个预算科的复核，这个复核蓝图里没写" },
    ],
    options: [
      {
        label: { en: "Formal control — model as approval", zh: "正式控制点——建模为审批" },
        implication: { en: "Adds a gate to PR-11 and a role binding for Budget Controller.", zh: "为 PR-11 增加控制关卡，并绑定预算专责角色。" },
      },
      {
        label: { en: "Informal — omit and let metaERP budget availability check cover it", zh: "非正式——不建模，由 metaERP 预算可用性检查覆盖" },
        implication: { en: "Simpler flow; risk that the practice re-emerges as a shadow step.", zh: "流程更简；但该做法可能以影子步骤形式重现。" },
      },
    ],
    followUpIds: [],
    raisedBy: byChallenger("2026-07-20"),
    round: 3,
  },
  {
    id: "Q-029",
    code: "Q-029",
    question: {
      en: "How should prepayment guarantee expiry interlock with contract performance?",
      zh: "预付款保函到期应如何与合同履约联动？",
    },
    whyItMatters: {
      en: "Tracked on a manual spreadsheet today with no system of record. An expired guarantee against an unperformed contract is a direct financial exposure — the ontology needs an object and an alerting event, or an explicit decision to leave it out of scope.",
      zh: "目前为手工台账、无系统记录。保函到期而合同未履约构成直接资金敞口——本体需要相应对象与预警事件，或明确决定不纳入范围。",
    },
    category: "process-gap",
    severity: "major",
    status: "asked",
    repoPath: "analysis/questions/Q-029.md",
    blocks: ["PR-11", "W-22"],
    citations: [
      { sourceId: "SRC-03", page: 4, locator: "41:00–55:00", snippet: "预付比例和保函到期怎么联动，我们现在是台账手工盯的" },
    ],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-20"),
    round: 3,
  },
  {
    id: "Q-031",
    code: "Q-031",
    question: {
      en: "At consolidation, who is accountable if the back-filled material code differs from the requester's intent?",
      zh: "归集时补录的物料编码与申报意图不符，责任归属如何界定？",
    },
    whyItMatters: {
      en: "Follow-up from Q-001. Materials completes a code the using department never saw. Without an accountability rule the ontology cannot decide whether code completion needs a confirmation event back to the requester.",
      zh: "Q-001 的后续问题。物资部补录的编码使用部门未曾确认。无责任规则，本体无法判断补码是否需要回到申报人的确认事件。",
    },
    category: "authority",
    severity: "minor",
    status: "draft",
    repoPath: "analysis/questions/Q-031.md",
    blocks: ["PR-01"],
    citations: [{ sourceId: "SRC-03", page: 1, locator: "00:00–14:00" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-27"),
    round: 3,
  },
  {
    id: "Q-033",
    code: "Q-033",
    question: {
      en: "Does a return document require re-inspection when the supplier redelivers?",
      zh: "退货后供应商重新交付，是否需要重新验收？",
    },
    whyItMatters: {
      en: "Follow-up from Q-018. Redelivery after return is not covered by any source — slide 42, the exception flowchart, could not be extracted.",
      zh: "Q-018 的后续问题。退货后重新交付在所有来源中均无覆盖——第42页异常流程图无法提取。",
    },
    category: "exception-path",
    severity: "major",
    status: "draft",
    repoPath: "analysis/questions/Q-033.md",
    blocks: ["PR-12", "PR-09"],
    citations: [{ sourceId: "SRC-01", page: 42, locator: "slide 42 (unreadable)" }],
    followUpIds: [],
    raisedBy: byAnalyst("2026-07-27"),
    round: 3,
  },
];
