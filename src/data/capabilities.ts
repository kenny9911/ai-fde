import type { Baseline, Capability } from "@/lib/types";

/**
 * The abstraction layer over metaERP. The ontology calls capabilities; only
 * this map knows that a capability lands on a Huawei metaERP service. That
 * indirection is what lets the ontology survive a package upgrade — and it is
 * also where the honest gaps live.
 */
export const capabilities: Capability[] = [
  {
    id: "procurement.requisition.create",
    name: { en: "Create requisition", zh: "创建请购单" },
    description: { en: "Raise material demand with budget account and project reference.", zh: "提出物资需求，带预算科目与项目号。" },
    scenarioIds: ["PR-01"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /procurement/purchaseRequisition:create",
      note: { en: "Direct mapping. WBS reference needs the optional projectElement field.", zh: "直接映射。WBS 需使用可选的 projectElement 字段。" },
    },
    openQuestionIds: ["Q-001"],
    citations: [{ sourceId: "SRC-02", page: 8, locator: "slide 8" }],
  },
  {
    id: "procurement.demand.consolidate",
    name: { en: "Consolidate demand into batches", zh: "需求归集成批次" },
    description: { en: "Group requisitions by category into annual or quarterly batches.", zh: "按品类将请购归集为年度或季度批次。" },
    scenarioIds: ["PR-01", "PR-02"],
    binding: {
      status: "partial",
      erpEndpoint: "metaERP /procurement/requirementGrouping",
      note: {
        en: "Standard grouping is by purchasing group, not by the client's material category taxonomy. Mapping table required.",
        zh: "标准分组按采购组，而非客户的物料品类分类。需建立映射表。",
      },
    },
    openQuestionIds: ["Q-002"],
    citations: [{ sourceId: "SRC-06", page: 1, locator: "sheet 1" }],
  },
  {
    id: "finance.budget.validate",
    name: { en: "Validate against budget", zh: "预算校验" },
    description: { en: "Check a document value against the available budget line.", zh: "校验单据金额是否在可用预算内。" },
    scenarioIds: ["PR-01", "PR-02", "PR-11"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /finance/budgetAvailabilityControl:check",
      note: { en: "Available at requisition and at payment. Whether the pre-payment call is a formal control is unresolved.", zh: "在请购与付款环节均可调用。付款前调用是否为正式控制点尚未确定。" },
    },
    openQuestionIds: ["Q-028"],
    citations: [{ sourceId: "SRC-03", page: 4, locator: "41:00–55:00" }],
  },
  {
    id: "sourcing.method.determine",
    name: { en: "Determine sourcing method", zh: "确定采购方式" },
    description: { en: "Apply the amount ladder plus justification override.", zh: "套用金额阶梯并处理理由驱动的例外。" },
    scenarioIds: ["PR-03"],
    binding: {
      status: "custom-required",
      note: {
        en: "metaERP has no sourcing-method decision object. The amount ladder and §18 authority matrix must live in the ontology as rules and be enforced by the abstraction layer.",
        zh: "metaERP 无采购方式决策对象。金额阶梯与第十八条权限矩阵须作为规则存在于本体，由抽象层强制执行。",
      },
    },
    openQuestionIds: ["Q-007"],
    citations: [{ sourceId: "SRC-05", page: 12, locator: "§18" }],
  },
  {
    id: "sourcing.method.approve",
    name: { en: "Approve sourcing method", zh: "审批采购方式" },
    description: { en: "Route the approval by amount to the correct authority level.", zh: "按金额将审批路由至相应权限层级。" },
    scenarioIds: ["PR-03", "PR-06"],
    binding: {
      status: "custom-required",
      note: { en: "Party-committee review above ¥20M has no counterpart in the standard workflow engine.", zh: "2000万以上的党委会审议在标准工作流引擎中无对应。" },
    },
    openQuestionIds: ["Q-007"],
    citations: [{ sourceId: "SRC-05", page: 12, locator: "§18" }],
  },
  {
    id: "sourcing.tender.publish",
    name: { en: "Publish tender notice", zh: "发布招标公告" },
    description: { en: "Publish to the provincial e-commerce platform.", zh: "发布至省电子商务平台。" },
    scenarioIds: ["PR-05"],
    binding: {
      status: "gap",
      note: {
        en: "Out of metaERP entirely. Owned by the e-commerce platform; the abstraction layer proxies to it.",
        zh: "完全在 metaERP 之外，由电子商务平台承担；抽象层代理调用。",
      },
    },
    openQuestionIds: [],
    citations: [{ sourceId: "SRC-02", page: 19, locator: "slide 19" }],
  },
  {
    id: "sourcing.award.record",
    name: { en: "Record award result", zh: "回写中标结果" },
    description: { en: "Bring winner and price back from the platform into the ERP.", zh: "将中标供应商与价格从平台回写至ERP。" },
    scenarioIds: ["PR-05"],
    binding: {
      status: "bound",
      erpEndpoint: "abstraction /sourcing/awardRecorded (inbound event)",
      note: {
        en: "Confirmed in scope at session S-03. Replaces the manual re-entry that lags two to three days.",
        zh: "S-03 会议确认纳入范围，替代目前滞后两三天的人工录入。",
      },
    },
    openQuestionIds: ["Q-016"],
    citations: [{ sourceId: "SRC-03", page: 2, locator: "14:00–28:00" }],
  },
  {
    id: "supplier.qualification.submit",
    name: { en: "Submit supplier qualification", zh: "提交供应商资质" },
    description: { en: "Supplier lodges credentials for a material category.", zh: "供应商按物料大类提交资质材料。" },
    scenarioIds: ["PR-04"],
    binding: {
      status: "partial",
      erpEndpoint: "metaERP /masterData/businessPartner/qualification:submit",
      note: { en: "Submission works; category scoping does not.", zh: "提交可用；按品类分段不可用。" },
    },
    openQuestionIds: ["Q-011"],
    citations: [{ sourceId: "SRC-02", page: 24, locator: "slide 24" }],
  },
  {
    id: "supplier.qualification.approve",
    name: { en: "Admit supplier to approved list", zh: "纳入合格供应商名录" },
    description: { en: "Category-scoped admission with two-year validity.", zh: "按品类纳入，有效期两年。" },
    scenarioIds: ["PR-04"],
    binding: {
      status: "gap",
      note: {
        en: "Blocked on Q-011. Either an extension object for category qualification, or a business change to PurchasingOrg scoping.",
        zh: "受阻于 Q-011。要么扩展品类资质对象，要么业务改用采购组织维度。",
      },
    },
    openQuestionIds: ["Q-011"],
    citations: [{ sourceId: "SRC-02", page: 24, locator: "slide 24" }],
  },
  {
    id: "contract.create",
    name: { en: "Create purchase contract", zh: "创建采购合同" },
    description: { en: "Contract carrying payment terms and prepayment ratio.", zh: "载明账期与预付比例的合同。" },
    scenarioIds: ["PR-07"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /procurement/purchaseContract:create",
      note: { en: "Header vs. line-level payment terms still to be settled (Q-024).", zh: "账期取抬头还是行项目待定（Q-024）。" },
    },
    openQuestionIds: ["Q-024"],
    citations: [{ sourceId: "SRC-02", page: 8, locator: "slide 8" }],
  },
  {
    id: "contract.change.apply",
    name: { en: "Apply contract change", zh: "执行合同变更" },
    description: { en: "Supplementary agreement; re-approval above 10% of original value.", zh: "补充协议；超原合同10%需重新审批。" },
    scenarioIds: ["PR-12"],
    binding: {
      status: "partial",
      erpEndpoint: "metaERP /procurement/purchaseContract:amend",
      note: { en: "Amendment exists; the 10% re-approval trigger is an ontology rule, not a package feature.", zh: "变更功能存在；10%重新审批触发为本体规则，非套件功能。" },
    },
    openQuestionIds: ["Q-033"],
    citations: [{ sourceId: "SRC-01", page: 45, locator: "slide 45" }],
  },
  {
    id: "procurement.order.issue",
    name: { en: "Issue purchase order", zh: "下达采购订单" },
    description: { en: "Call-off against a contract.", zh: "基于合同的订单下达。" },
    scenarioIds: ["PR-08"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /procurement/purchaseOrder:create",
      note: { en: "Clean standard mapping; documentFlow provides traceability.", zh: "标准映射清晰；documentFlow 提供可追溯性。" },
    },
    openQuestionIds: [],
    citations: [{ sourceId: "SRC-02", page: 8, locator: "slide 8" }],
  },
  {
    id: "inventory.goodsReceipt.post",
    name: { en: "Post goods receipt", zh: "过账收货单" },
    description: { en: "Register receipt on delivery day.", zh: "到货当天登记收货。" },
    scenarioIds: ["PR-09"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /inventory/goodsReceipt:post",
      note: { en: "Modelled as immutable following the S-03 decision.", zh: "依 S-03 决议建模为不可变。" },
    },
    openQuestionIds: [],
    citations: [{ sourceId: "SRC-02", page: 8, locator: "slide 8" }],
  },
  {
    id: "quality.inspection.record",
    name: { en: "Record inspection result", zh: "记录验收结论" },
    description: { en: "Pass, fail, or concession with executive sign-off.", zh: "合格、不合格或需签批的让步接收。" },
    scenarioIds: ["PR-09"],
    binding: {
      status: "partial",
      erpEndpoint: "metaERP /quality/inspectionLot:record",
      note: { en: "Standard supports pass/fail. Concession with executive sign-off needs a custom status and approval hop.", zh: "标准支持合格/不合格。让步接收及领导签批需自定义状态与审批环节。" },
    },
    openQuestionIds: [],
    citations: [{ sourceId: "SRC-01", page: 31, locator: "slide 31" }],
  },
  {
    id: "inventory.return.post",
    name: { en: "Post return to supplier", zh: "过账退货" },
    description: { en: "Compensating document against a failed inspection.", zh: "针对验收不合格的补偿单据。" },
    scenarioIds: ["PR-12"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /inventory/returnDelivery:post",
      note: { en: "Available and preferred over reversal, per the S-03 decision.", zh: "依 S-03 决议，优于冲销方案且功能可用。" },
    },
    openQuestionIds: ["Q-033"],
    citations: [{ sourceId: "SRC-03", page: 3, locator: "28:00–41:00" }],
  },
  {
    id: "finance.invoice.register",
    name: { en: "Register supplier invoice", zh: "登记供应商发票" },
    description: { en: "Capture the invoice for matching.", zh: "登记发票以供匹配。" },
    scenarioIds: ["PR-10"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /finance/supplierInvoice:create",
      note: { en: "Standard mapping.", zh: "标准映射。" },
    },
    openQuestionIds: [],
    citations: [{ sourceId: "SRC-02", page: 8, locator: "slide 8" }],
  },
  {
    id: "finance.threeWayMatch.run",
    name: { en: "Run three-way match", zh: "执行三单匹配" },
    description: { en: "Reconcile order, receipt and invoice within tolerance.", zh: "在容差范围内核对订单、收货单与发票。" },
    scenarioIds: ["PR-10"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /finance/invoiceVerification:match",
      note: { en: "Tolerance is per CompanyCode. Whether provinces may configure it is unresolved (Q-026).", zh: "容差按公司代码配置。省公司是否可自行配置尚未确定（Q-026）。" },
    },
    openQuestionIds: ["Q-026"],
    citations: [{ sourceId: "SRC-02", page: 15, locator: "slide 15" }],
  },
  {
    id: "finance.payment.request",
    name: { en: "Raise payment request", zh: "发起付款申请" },
    description: { en: "Payment proposal within contract terms.", zh: "按合同账期生成付款建议。" },
    scenarioIds: ["PR-11"],
    binding: {
      status: "bound",
      erpEndpoint: "metaERP /finance/paymentProposal:create",
      note: { en: "Standard mapping; the budget re-check hop depends on Q-028.", zh: "标准映射；预算复核环节取决于 Q-028。" },
    },
    openQuestionIds: ["Q-028"],
    citations: [{ sourceId: "SRC-01", page: 34, locator: "slide 34" }],
  },
  {
    id: "finance.guarantee.track",
    name: { en: "Track prepayment guarantee", zh: "跟踪预付款保函" },
    description: { en: "Interlock guarantee expiry with contract performance.", zh: "保函到期与合同履约联动。" },
    scenarioIds: ["PR-11"],
    binding: {
      status: "manual-today",
      note: {
        en: "A spreadsheet with no system of record. Scope decision pending on Q-029 before any binding is designed.",
        zh: "目前为无系统记录的手工台账。在 Q-029 范围决策前不设计绑定。",
      },
    },
    openQuestionIds: ["Q-029"],
    citations: [{ sourceId: "SRC-03", page: 4, locator: "41:00–55:00" }],
  },
];

/**
 * The freeze gate. Gates are deliberately expressed as measurable thresholds
 * with named offenders — "quality" that cannot be pointed at is not a gate,
 * it is an opinion.
 */
export const baseline: Baseline = {
  version: "BUB-0.3-draft",
  status: "open",
  repoPath: "baseline/BUB-0.3-draft.md",
  signedOffBy: [
    { name: "Wang Lei", role: { en: "Lead ERP Consultant", zh: "ERP主顾问" } },
    { name: "Chen Yu", role: { en: "Lead FDE", zh: "主任FDE" } },
    { name: "Zhang Min", role: { en: "Procurement Section Head", zh: "采购科科长" } },
  ],
  gates: [
    {
      id: "G-1",
      name: { en: "No unanswered blocker questions", zh: "无未答复的阻断级问题" },
      rationale: {
        en: "A blocker is defined as a question whose answer changes the shape of an ontology object. Freezing over one guarantees rework.",
        zh: "阻断级问题指其答案会改变本体对象形态的问题。带着它冻结必然返工。",
      },
      status: "fail",
      actual: "3 open",
      threshold: "0",
      offenders: ["Q-007", "Q-011", "Q-028"],
    },
    {
      id: "G-2",
      name: { en: "All challenge findings adjudicated", zh: "全部质证发现已裁定" },
      rationale: {
        en: "An open finding means the analyst and challenger still disagree about what is true.",
        zh: "存在未裁定发现，意味着分析与质证对事实仍有分歧。",
      },
      status: "fail",
      actual: "1 open, 1 needs clarification",
      threshold: "0 open",
      offenders: ["C-010", "C-009"],
    },
    {
      id: "G-3",
      name: { en: "Scenario source coverage ≥ 70%", zh: "场景来源覆盖率 ≥ 70%" },
      rationale: {
        en: "A scenario reconstructed from a fraction of the material is a guess wearing a diagram.",
        zh: "仅凭少量材料还原的场景，本质是披着流程图的猜测。",
      },
      status: "fail",
      actual: "PR-12 at 41%, PR-06 at 54%",
      threshold: "≥70% each",
      offenders: ["PR-12", "PR-06"],
    },
    {
      id: "G-4",
      name: { en: "No unextracted source pages in scope", zh: "范围内无未提取的来源页" },
      rationale: {
        en: "Slide 42 is the exception-handling flowchart. Freezing without it means freezing without the exception paths.",
        zh: "第42页正是异常处理流程图。不解决它就冻结，等于冻结了一个没有异常路径的模型。",
      },
      status: "fail",
      actual: "4 pages unreadable",
      threshold: "0",
      offenders: ["SRC-01:42", "SRC-04:17", "SRC-04:18", "SRC-04:19"],
    },
    {
      id: "G-5",
      name: { en: "Every capability has a binding decision", zh: "每项能力均有绑定结论" },
      rationale: {
        en: "An unbound capability is an unowned integration. It will surface in build as a surprise.",
        zh: "未绑定的能力即无人负责的集成，会在开发期以意外的形式出现。",
      },
      status: "warn",
      actual: "1 gap, 1 manual-today",
      threshold: "0 undecided",
      offenders: ["supplier.qualification.approve", "finance.guarantee.track"],
    },
    {
      id: "G-6",
      name: { en: "Every claim carries a citation", zh: "所有结论均有来源引用" },
      rationale: {
        en: "The baseline is a document people sign. An uncited claim cannot be defended in a review.",
        zh: "基线是需要签字的文件。无引用的结论在评审中无法辩护。",
      },
      status: "pass",
      actual: "100%",
      threshold: "100%",
      offenders: [],
    },
    {
      id: "G-7",
      name: { en: "Bilingual completeness", zh: "中英双语完整性" },
      rationale: {
        en: "The client reviews in Chinese; the delivery team builds in English. A single-language baseline gets read by half the room.",
        zh: "客户以中文评审，交付团队以英文开发。单语基线只有一半的人能读。",
      },
      status: "pass",
      actual: "100%",
      threshold: "100%",
      offenders: [],
    },
  ],
  scope: [
    {
      id: "SC-1",
      item: { en: "Materials procurement, requisition to payment", zh: "物资采购：请购至付款" },
      decision: "in",
      rationale: { en: "The engagement's core mandate.", zh: "本次咨询的核心范围。" },
      decidedBy: "Chen Yu",
      decidedAt: "2026-06-20",
    },
    {
      id: "SC-2",
      item: { en: "Tendering execution on the e-commerce platform", zh: "电子商务平台上的招标执行" },
      decision: "out",
      rationale: {
        en: "Owned by the platform team. We model the boundary and the award write-back event only.",
        zh: "由平台团队负责。我方仅建模边界与中标回写事件。",
      },
      decidedBy: "Chen Yu",
      decidedAt: "2026-07-02",
    },
    {
      id: "SC-3",
      item: { en: "Spare-parts consignment procurement", zh: "备品备件寄售采购" },
      decision: "out",
      rationale: { en: "Different commercial model; deferred to phase 2.", zh: "商业模式不同，推迟至二期。" },
      decidedBy: "Chen Yu",
      decidedAt: "2026-07-22",
    },
    {
      id: "SC-4",
      item: { en: "Prepayment guarantee tracking", zh: "预付款保函跟踪" },
      decision: "deferred",
      rationale: {
        en: "Real financial exposure, but no stated requirement. Awaiting Q-029 before deciding.",
        zh: "存在真实资金敞口，但无明确需求。待 Q-029 答复后决定。",
      },
      decidedBy: "Wang Lei",
      decidedAt: "2026-07-26",
    },
    {
      id: "SC-5",
      item: { en: "Service and works procurement", zh: "服务与工程采购" },
      decision: "out",
      rationale: { en: "Separate regulation and approval chain; out of the materials mandate.", zh: "适用不同制度与审批链，超出物资采购范围。" },
      decidedBy: "Wang Lei",
      decidedAt: "2026-06-20",
    },
  ],
};
